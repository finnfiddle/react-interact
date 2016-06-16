import React from 'react'
import stamp from 'react-stamp'
import cloneDeep from 'lodash.clonedeep'

import {
  isSet,
  isFunction,
  normalizeResource,
  addNamesToResources,
} from './utils'
import fetch from './fetch'
import mergeResponse from './mergeResponse'
import createResourcesMutator from './createResourcesMutator'
import DefaultAgent from './defaultAgent'

let Interact = {

  state: {},
  containers: [],

  setState(state) {
    Object.assign(Interact.state, state)
    Interact.containers.forEach(container => container.updateState(Interact.state))
  },

  getState() {
    return Object.assign({}, Interact.state)
  },

  request(params) {
    return DefaultAgent(params)
  },

  createContainer(WrappedElement, resources, agent) {
    return stamp(React)
      .compose({

        init() {
          this.WrappedElement = WrappedElement

          this.resources = {}
          for (let key in resources) {
            this.resources[key] = normalizeResource(resources[key])
          }

          addNamesToResources(this.resources)

          this.agent = agent || DefaultAgent

          Interact.containers.push(this)
        },

        state: Object.assign({}, Interact.getState(), {_hasFetched: false}),

        componentDidMount() {
          console.log('componentDidMount')
          this.fetch({props: this.props})
        },

        componentWillReceiveProps(nextProps) {
          console.log('componentWillReceiveProps')
          this.fetch({props: nextProps})
        },

        render() {
          let result
          let Wrapped

          if (this.state._hasFetched) {
            Wrapped = this.WrappedElement
            result = (
              <Wrapped
                {...this.state}
                {...this.props}
                interact={this.requestHandler()}
              />
            )
          }
          else {
            // TODO: loading component
            result = (
              <div />
            )
          }

          return result
        },

        updateState(state) {
          this.setState(state)
        },

        requestHandler() {
          return createResourcesMutator.call(this)
        },

        handleResponse({
          request,
          response,
        }) {
          const { resource } = request.meta

          if (resource.isResource) {
            if (isFunction(request.callback)) {
              try {
                let clonedResource = cloneDeep(this.state[resource.name])
                request.callback(response, clonedResource, (updatedResource) => {
                  if (isSet(updatedResource)) {
                    this.setState({[resource.name]: updatedResource})
                  }
                })
              }
              catch (error) {
                console.log(error)
              }
            }
            else {
              mergeResponse({
                currentData: this.state[resource.name],
                response,
                request,
              })
              .then(result => this.setState({[resource.name]: result}))
            }
          }
          else if (isFunction(request.callback)) {
            try {
              request.callback(response)
            }
            catch (error) {
              console.log(error)
            }
          }
        },

        fetch({ props }) {
          fetch.call(this, {props})
            .then(result => {
              this.setState(Object.assign({}, result, {_hasFetched: true}))
            })
            .catch(err => console.log(err))
        },

      })
  },

}

export default Interact
