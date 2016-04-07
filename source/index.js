import React from 'react'
import stamp from 'react-stamp'
import cloneDeep from 'lodash.clonedeep'

import {
  isSet,
  isFunction,
  fetch,
  mergeResponse,
  normalizeResource,
  addNamesToResources,
} from './utils'
import DefaultAgent from './defaultAgent'
import ResourcesMutator from './resourcesMutator'

export default {

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
        },

        state: {
          _hasFetched: false,
        },

        componentDidMount() {
          this.fetch({props: this.props})
        },

        componentWillReceiveProps(nextProps) {
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

        requestHandler() {
          return ResourcesMutator.call(this)
        },

        handleResponse({
          request,
          response,
        }) {
          const { resource } = request.meta

          if (isFunction(request.callback)) {
            let clonedResource = cloneDeep(this.state[resource.name])
            request.callback(response, clonedResource, (updatedResource) => {
              console.log({[resource.name]: updatedResource})
              if (isSet(updatedResource)) {
                this.setState({[resource.name]: updatedResource})
              }
            })
          }
          else {
            mergeResponse({
              currentData: this.state[resource.name],
              response,
              request,
            })
            .then(result => this.setState({[resource.name]: result}))
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
