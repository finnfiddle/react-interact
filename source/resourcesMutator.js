import { isSet } from './utils'

export function createMutator({ key }) {

  let resource = this.resources[key]

  let Mutator = (id, query) => {

    let subMutator = {

      update: (payload, callback) => this.agent.call(this, {
        uri: resource.getUri({
          operationName: 'update',
          props: this.props,
          id,
          query,
        }),
        method: resource.getMethod({operationName: 'update'}),
        payload,
        callback,
        meta: {
          operationName: 'update',
          resource,
        },
      })
      .then(this.handleResponse.bind(this))
      .catch(err => console.log(err)),

      read: (callback) => this.agent.call(this, {
        uri: resource.getUri({
          operationName: 'read',
          props: this.props,
          id,
          query,
        }),
        method: resource.getMethod({operationName: 'read'}),
        callback,
        meta: {
          operationName: 'read',
          resource,
        },
      })
      .then(this.handleResponse.bind(this))
      .catch(err => console.log(err)),

      remove: (callback) => this.agent.call(this, {
        uri: resource.getUri({
          operationName: 'remove',
          props: this.props,
          id,
          query,
        }),
        method: resource.getMethod({operationName: 'remove'}),
        callback,
        meta: {
          operationName: 'remove',
          resource,
        },
      })
      .then(this.handleResponse.bind(this))
      .catch(err => console.log(err)),
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

  Mutator.create = (payload, callback) => this.agent.call(this, {
    uri: resource.getUri({operationName: 'create', props: this.props}),
    method: resource.getMethod({operationName: 'create'}),
    payload,
    callback,
    meta: {
      operationName: 'create',
      resource,
    },
  })
  .then(this.handleResponse.bind(this))
  .catch(err => console.log(err))

  Mutator.list = (callback) => this.agent.call(this, {
    uri: resource.getUri({operationName: 'list', props: this.props}),
    method: resource.getMethod({operationName: 'list'}),
    callback,
    meta: {
      operationName: 'list',
      resource,
    },
  })
  .then(this.handleResponse.bind(this))
  .catch(err => console.log(err))

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
