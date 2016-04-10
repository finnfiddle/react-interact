import { isSet } from './utils'

const handleMutation = function ({
  operationName,
  resource,
  id,
  query,
  props,
  payload,
  callback,
}) {
  return this.agent.call(this, {
    uri: resource.getUri({
      operationName,
      props: this.props,
      id,
      query,
    }),
    method: resource.getMethod({operationName}),
    headers: resource.headers,
    payload,
    callback,
    meta: {
      operationName,
      resource,
    },
  })
  .then(this.handleResponse.bind(this))
  .catch(err => console.log(err))
}

export function createMutator({ key }) {

  let resource = this.resources[key]

  let Mutator = ({ id, query }) => {

    let subMutator = {

      read: (callback) => handleMutation.call(this, {
        operationName: 'read',
        resource,
        id,
        query,
        props: this.props,
        callback,
      }),

      fetch: (callback) => handleMutation.call(this, {
        operationName: 'fetch_item',
        resource,
        id,
        query,
        props: this.props,
        callback,
      }),

      update: (payload, callback) => handleMutation.call(this, {
        operationName: 'update',
        resource,
        id,
        query,
        props: this.props,
        payload,
        callback,
      }),

      remove: (callback) => handleMutation.call(this, {
        operationName: 'remove',
        resource,
        id,
        query,
        props: this.props,
        callback,
      }),

      list: (callback) => handleMutation.call(this, {
        operationName: 'list',
        resource,
        query,
        props: this.props,
        callback,
      }),
    }

    if (isSet(resource.subs)) {
      for (let sk in resource.subs) {
        resource.subs[sk].parentBase = resource.getUri({
          operationName: 'read',
          props: this.props,
          id,
        })

        subMutator[sk] = createMutator.call(
          {
            props: this.props,
            resources: resource.subs,
            agent: this.agent,
            handleResponse: this.handleResponse.bind(this),
          },
          {
            key: sk,
          }
        )
      }
    }

    return subMutator

  }

  Mutator.create = (payload, callback) => handleMutation.call(this, {
    operationName: 'create',
    resource,
    props: this.props,
    payload,
    callback,
  })

  Mutator.list = (callback) => handleMutation.call(this, {
    operationName: 'list',
    resource,
    props: this.props,
    callback,
  })

  Mutator.fetch = (callback) => handleMutation.call(this, {
    operationName: 'fetch',
    resource,
    props: this.props,
    callback,
  })

  return Mutator

}

export default function() {

  let mutator = {}

  for (let key in this.resources) {

    mutator[key] = createMutator.call(this, {
      key,
    })

  }

  return mutator
}
