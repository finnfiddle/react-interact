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

  const uri = resource.getUri({
    operationName,
    props,
    id,
    query,
  })

  const method = resource.getMethod({operationName})

  const headers = resource.headers

  resource.onRequest({uri, method, headers})

  return this.agent.call(this, {
    uri,
    method,
    headers,
    payload,
    callback,
    meta: {
      operationName,
      resource,
    },
  })
  .then(({ response, request }) => {
    resource.onSuccess({uri, method, headers, response})
    this.handleResponse.call(this, {response, request})
  })
  .catch(({ response, request }) => {
    resource.onFailure({uri, method, headers, response})
    this.handleResponse.call(this, {response, request})
  })
}

export default function createResourceMutator({ key }) {

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

        subMutator[sk] = createResourceMutator.call(
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
