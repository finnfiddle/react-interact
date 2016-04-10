import { Promise } from 'es6-promise'
import qs from 'qs'
import cloneDeep from 'lodash.clonedeep'
import findIndex from 'lodash.findindex'
import get from 'lodash.get'
import { map as asyncMap } from 'nimble'

import { OPERATIONS, RESOURCE_DEFAULTS } from './constants'

const RE = /\$\{(.[^}]*)\}/

const isSet = (val) => typeof val !== 'undefined' && val !== null
const isString = (val) => typeof val === 'string'
const isFunction = (val) => typeof val === 'function'

const normalizeOperation = ({ resource, operationName, defaultMethod }) => {
  let result
  if (isSet(resource[operationName])) {
    if (isString(resource[operationName])) {
      result = {
        method: defaultMethod,
        uri: resource[operationName],
      }
    }
    else {
      result = Object.assign(
        {method: defaultMethod},
        resource[operationName]
      )
    }
  }

  return result
}

const matchAndReplace = function (input, params) {
  let match
  let result = input

  while ((match = RE.exec(result)) !== null) {
    result = result.replace(match[0], get(params, match[1]))
  }

  return result
}

const getBase = function ({ id, props }) {
  const parentBase = this.parentBase || ''
  const params = {id, props}
  const base = this.base || ''

  return `${parentBase}${matchAndReplace(base, params)}`
}

const addQuery = function (query, uri) {
  if (!isSet(query)) return uri
  if (uri.indexOf('?') > -1) {
    const parts = qs.parse(uri.split('?'))
    const existingQuery = parts[1]
    return `${parts[0]}?${qs.stringify(
      Object.assign({}, existingQuery, query)
    )}`
  }
  else {
    return `${uri}?${qs.stringify(query)}`
  }
}

const getNormalizedOperationName = (operationName) => {
  if (operationName === 'fetch') return 'list'
  if (operationName === 'fetch_item') return 'read'
  return operationName
}

const getUri = function ({ operationName, id, props, query }) {
  const _operationName = getNormalizedOperationName(operationName)
  const params = {id, props}
  const uri = this[_operationName || this.defaultOperation].uri
  let result = `${this.getBase(params)}${matchAndReplace(uri, params)}`
  return addQuery(query, result)
}

const getMethod = function ({ operationName }) {
  const _operationName = getNormalizedOperationName(operationName)
  return this[_operationName || this.defaultOperation].method
}

const normalizeResource = (resourceData) => {
  let resource = {}
  let normalizedResourceData

  if (isString(resourceData)) {
    normalizedResourceData = {
      base: resourceData,
      item: '/${id}',
    }
  }
  else {
    normalizedResourceData = resourceData
  }

  const data = Object.assign({}, RESOURCE_DEFAULTS, normalizedResourceData)

  resource.defaultOperation = data.defaultOperation
  resource.base = data.base
  resource.uid = data.uid
  if (isSet(data.parentBase)) resource.parentBase = data.parentBase
  resource.list = normalizeOperation({
    resource: data,
    operationName: 'list',
    defaultMethod: 'GET',
  })
  resource.create = normalizeOperation({
    resource: data,
    operationName: 'create',
    defaultMethod: 'POST',
  })

  if (isSet(data.item)) {
    resource.read = {method: 'GET', uri: data.item}
    resource.update = {method: 'PUT', uri: data.item}
    resource.patch = {method: 'PATCH', uri: data.item}
    resource.remove = {method: 'DELETE', uri: data.item}
  }
  else {

    OPERATIONS.forEach((operation) => {
      resource[operation.name] = normalizeOperation({
        resource: data,
        operationName: operation.name,
        defaultMethod: operation.defaultMethod,
      })
    })
  }

  if (isSet(data.subs)) {
    resource.subs = {}
    for (let subKey in data.subs) {
      resource.subs[subKey] = normalizeResource(data.subs[subKey])
    }
  }

  resource.getBase = getBase.bind(resource)
  resource.getUri = getUri.bind(resource)
  resource.getMethod = getMethod.bind(resource)

  return resource
}

const addNamesToResources = (resources) => {
  for (let name in resources) resources[name].name = name
}

const mergeResponse = ({ currentData, response, request }) => {

  return new Promise(resolve => {
    let data = cloneDeep(currentData)
    const { resource, operationName } = request.meta
    const uid = resource.uid
    const { body } = response

    const updateItem = (collection, newItemData) => {
      let item = collection.filter(d => d[uid] === newItemData[uid])[0]
      if (isSet(item)) Object.assign(item, newItemData)
    }

    switch (operationName) {
      case 'create':
        data.push(body)
        break
      case 'patch':
      case 'update':
      case 'fetch_item':
        updateItem(data, body)
        break
      case 'remove':
        const index = findIndex(data, {[uid]: body[uid]})
        data.splice(index, 1)
        break
      case 'fetch':
        data.length = 0
        Array.prototype.push.apply(data, body)
        break
      default:
        break
    }

    resolve(data)
  })
}

const fetch = function ({ props }) {

  let result = {}

  return new Promise((resolve, reject) => {
    asyncMap(this.resources, (resource, key, next) => {
      if (!isSet(resource.defaultOperation)) {
        next()
      }
      else {
        this
          .agent.call(this, {
            uri: resource.getUri({props}),
            method: resource.getMethod({}),
          })
          .then(({ response }) => {
            result[key] = response.body
            next(null)
          })
          .catch(err => console.log(err))
      }

    }, (err) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

}

export default {
  isSet,
  isString,
  isFunction,
  fetch,
  getBase,
  getUri,
  getMethod,
  normalizeResource,
  normalizeOperation,
  addNamesToResources,
  mergeResponse,
  addQuery,
}
