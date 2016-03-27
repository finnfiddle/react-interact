import { Promise } from 'es6-promise'
import cloneDeep from 'lodash.clonedeep'
import rejectWhere from 'lodash.reject'
import { map as asyncMap } from 'nimble'

import { OPERATIONS, RESOURCE_DEFAULTS } from './constants'

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

const fetch = ({ params, getResources, agent }) => {

  let result = {}
  let resources = getResources(params)

  return new Promise((resolve, reject) => {
    asyncMap(resources, (resource, key, next) => {
      const operationName = resource.defaultOperation

      agent({
        uri: `${resource.base}${resource[operationName].uri}`,
        resource,
        method: resource[operationName].method,
      })
      .then(({ response }) => {
        result[key] = response.body
        next(null)
      })

    }, (err) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

}

const normalizeResource = (resourceData) => {
  let resource = {}

  const data = Object.assign({}, RESOURCE_DEFAULTS, resourceData)

  resource.defaultOperation = data.defaultOperation
  resource.base = data.base
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
    resource.select = {uri: data.item}
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

  return resource
}

const addNamesToResources = (resources) => {
  for (let name in resources) resources[name].name = name
}

const mergeResponse = ({ currentData, response, request }) => {

  return new Promise(resolve => {
    let data = cloneDeep(currentData)
    const { resource, operationName } = request
    const uid = { resource }
    const { body } = response

    switch (operationName) {
      case 'create':
        data.push(body)
        break
      case 'patch':
      case 'update':
        let updatee = data.filter(d => d[uid] === body[uid])[0]
        if (isSet(updatee)) Object.assign(updatee, body)
        break
      case 'remove':
        rejectWhere(data, {[uid]: body[uid]})
        break
      default:
        break
    }

    resolve(data)
  })

}

export default {
  isSet,
  isString,
  isFunction,
  fetch,
  normalizeResource,
  normalizeOperation,
  addNamesToResources,
  mergeResponse,
}
