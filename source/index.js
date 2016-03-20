import React, { PropTypes } from 'react'
// import stamp from 'react-stamp'
import _ from 'nimble'
import cloneDeep from 'lodash.clonedeep'
import reject from 'lodash.reject'

import { OPERATIONS, RESOURCE_DEFAULTS } from './constants'
import { isSet, isString, isFunction } from './utils'
import DefaultAgent from './defaultAgent'

export default {

  createContainer(WrappedElement, getResources, agent) {
    return React.createClass({
      WrappedElement: WrappedElement,
      getResources: getResources,
      agent: agent || DefaultAgent(),

      getInitialState() {
        return {
          _hasFetched: false,
        }
      },

      componentDidMount() {
        this.fetch(this.props)
      },

      componentWillReceiveProps(nextProps) {
        this.fetch({props: nextProps})
      },

      render() {
        const WrappedElement = this.WrappedElement
        if(this.state._hasFetched) {
          return (
            <WrappedElement
              {...this.state}
              {...this.props}
              reflect={::this.handleRequest}
            />
          )
        } else {
          // TO DO: loading component
          return <div />
        }
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
          this.setState(Object.assign({}, result, {_hasFetched: true}))
        })
      },

      _getRequest({ resource, operationName, data }) {
        resource = this._normalizeResource(resource)
        let operation
        if(typeof operationName === 'undefined') {
          operation = resource[resource.defaultOperation]
        }
        else {
          operation = resource[operationName]
        }
        return this.agent.request({operation, resource, data})
      },

      _normalizeResource(resourceData) {
        let resource = {}

        resourceData = Object.assign(RESOURCE_DEFAULTS, resourceData)

        resource.defaultOperation = resourceData.defaultOperation
        resource.base = resourceData.base
        resource.list = this._normalizeOperation({
          resource: resourceData,
          operationName: 'list',
          defaultMethod: 'GET',
        })
        resource.create = this._normalizeOperation({
          resource: resourceData,
          operationName: 'create',
          defaultMethod: 'POST',
        })

        if(isSet(resourceData.item)) {
          resource.read = {method: 'GET', uri: resourceData.item}
          resource.update = {method: 'PUT', uri: resourceData.item}
          resource.patch = {method: 'PATCH', uri: resourceData.item}
          resource.remove = {method: 'DELETE', uri: resourceData.item}
        }
        else {

          OPERATIONS.forEach((operation) => {
            resource[operation.name] = this._normalizeOperation({
              resource: resourceData,
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
