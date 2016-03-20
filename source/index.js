import React from 'react'
import stamp from 'react-stamp'
import _ from 'nimble'
import cloneDeep from 'lodash.clonedeep'
import reject from 'lodash.reject'

import { OPERATIONS, RESOURCE_DEFAULTS } from './constants'
import { isSet, isString, isFunction } from './utils'
import DefaultAgent from './defaultAgent'

export default {

  createContainer(WrappedElement, getResources, agent) {
    return stamp(React)
      .compose({

        init() {
          this.WrappedElement = WrappedElement
          this.getResources = getResources
          this.agent = agent || DefaultAgent()
        },

        state: {
          _hasFetched: false,
        },

        componentDidMount() {
          this.fetch(this.props)
        },

        componentWillReceiveProps(nextProps) {
          this.fetch({props: nextProps})
        },

        render() {
          let result
          if(this.state._hasFetched) {
            const Wrapped = this.WrappedElement
            result = (
              <Wrapped
                {...this.state}
                {...this.props}
                interact={::this.handleRequest}
              />
            )
          }
          else {
            // TO DO: loading component
            result = (
              <div />
            )
          }
          return result
        },

        handleRequest(resourceName, operationName, data, callback) {
          const resource = this.getResources({
            props: this.props,
            id: data.id,
            payload: data.payload,
          })[resourceName]

          this._getRequest({resource, operationName, data})
            .end(this._handleResponse({
              resourceName,
              operationName,
              callback,
            }))
        },

        _handleResponse({
          resource,
          resourceName,
          operationName,
          callback,
        }) {
          return (err, res) => {
            if(err) reject(err)
            if(!res.ok) reject(res.body)
            if(isFunction(callback)) {
              let clonedResource = cloneDeep(this.state[resourceName])
              callback(res.body, clonedResource, () => {
                this.setState({[resourceName]: clonedResource})
              })
            }
            else {
              this._mergeResponse({
                response: res.body,
                resource,
                resourceName,
                operationName,
              })
            }
          }
        },

        _mergeResponse({
          response,
          resource,
          resourceName,
          operationName,
        }){
          let data = cloneDeep(this.state)[resourceName]
          const uid = { resource }

          switch(operationName) {
            case 'create':
              data.push(response)
              break
            case 'patch':
            case 'update':
              let updatee = data.filter(d => d[uid] === response[uid])[0]
              if(isSet(updatee)) Object.assign(updatee, response)
              break
            case 'remove':
              reject(data, {[uid]: response[uid]})
              break
            default:
              break
          }
          this.setState({[resourceName]: data})
        },

        fetch(props) {
          let result = {}
          let resources = getResources({props})
          _.map(resources, (resource, key, next) => {
            this._getRequest({resource}).end((err, res) => {
              if(err) return next(err)
              if(!res.ok) return next(res)
              result[key] = res.body
              next(null)
            })
          }, (err) => {
            if(err) console.log(err)
            this.setState(Object.assign({}, result, {_hasFetched: true}))
          })
        },

        _getRequest({ resource, operationName, data }) {
          const normalizedResource = this._normalizeResource(resource)
          let operation
          if(typeof operationName === 'undefined') {
            operation = normalizedResource[normalizedResource.defaultOperation]
          }
          else {
            operation = normalizedResource[operationName]
          }
          return this.agent.request({
            operation,
            resource: normalizedResource,
            data
          })
        },

        _normalizeResource(resourceData) {
          let resource = {}

          const data = Object.assign({}, RESOURCE_DEFAULTS, resourceData)

          resource.defaultOperation = data.defaultOperation
          resource.base = data.base
          resource.list = this._normalizeOperation({
            resource: data,
            operationName: 'list',
            defaultMethod: 'GET',
          })
          resource.create = this._normalizeOperation({
            resource: data,
            operationName: 'create',
            defaultMethod: 'POST',
          })

          if(isSet(data.item)) {
            resource.read = {method: 'GET', uri: data.item}
            resource.update = {method: 'PUT', uri: data.item}
            resource.patch = {method: 'PATCH', uri: data.item}
            resource.remove = {method: 'DELETE', uri: data.item}
          }
          else {

            OPERATIONS.forEach((operation) => {
              resource[operation.name] = this._normalizeOperation({
                resource: data,
                operationName: operation.name,
                defaultMethod: operation.defaultMethod,
              })
            })
          }

          return resource
        },

        _normalizeOperation({ resource, operationName, defaultMethod }) {
          let result
          if(isSet(resource[operationName])) {
            if(isString(resource[operationName])) {
              result = {
                method: defaultMethod,
                uri: resource[operationName]
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
        },

      })
  },

  // resource(base, name, props) {
  //   return {
  //     base: `${base}/${name}`,
  //     item: `/${props.params[name]}`,
  //   }
  // },

}
