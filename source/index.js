import React from 'react'
import stamp from 'react-stamp'
import cloneDeep from 'lodash.clonedeep'

import {
  isFunction,
  fetch,
  normalizeResource,
  addNamesToResources,
  mergeResponse,
  getNormalizedResources,
} from './utils'
import DefaultAgent from './defaultAgent'
import ResourcesMutator from './resourcesMutator'

export default {

  createContainer(WrappedElement, getResources, agent) {
    return stamp(React)
      .compose({

        init() {
          this.WrappedElement = WrappedElement
          this.getResources = params => getNormalizedResources(
            params,
            getResources
          )
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
                interact={::this.requestHandler()}
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

        requestHandler() {
          return ResourcesMutator({
            agent: this.agent,
            getResources: this.getResources,
            props: this.props,
            onResponse: this._handleResponse.bind(this),
          })
        },

        _handleResponse({
          request,
          response,
        }) {
          const { resource } = request

          if (isFunction(request.callback)) {
            let clonedResource = cloneDeep(this.state[resource.name])
            request.callback(response, clonedResource, () => {
              this.setState({[resource.name]: clonedResource})
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
          fetch({
            params: {props},
            agent: this.agent,
            getResources: this.getResources,
          })
          .then(result => {
            this.setState(Object.assign({}, result, {_hasFetched: true}))
          })
        },

      })
  },

}
