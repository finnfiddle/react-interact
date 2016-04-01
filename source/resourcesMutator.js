let ResourcesMutator

export let createMutator = ({
  agent,
  key,
  getResources,
  props,
  base,
  onResponse,
}) => {

  const baseUri = base || ''
  let resource = getResources({props})[key]

  let Mutator = (id) => {

    let selectedResource = getResources({id, props})[key]

    let subMutator = {

      update: (payload, callback) => agent({
        uri: `${baseUri}${selectedResource.base}${selectedResource.update.uri}`,
        operationName: 'update',
        resource: selectedResource,
        payload,
        callback,
      })
      .then(onResponse),

      read: (callback) => agent({
        uri: `${baseUri}${selectedResource.base}${selectedResource.read.uri}`,
        operationName: 'read',
        resource: selectedResource,
        callback,
      })
      .then(onResponse),

      remove: (callback) => agent({
        uri: `${baseUri}${selectedResource.base}${selectedResource.remove.uri}`,
        operationName: 'remove',
        resource: selectedResource,
        callback,
      })
      .then(onResponse),

    }

    for (let sk in resource.subs) {
      subMutator[sk] = ResourcesMutator({
        agent,
        getResources: resource.subs,
        props,
        base: `${baseUri}${resource.base}${resource.select}`,
        onResponse,
      })
    }

    return subMutator

  }

  Mutator.create = (payload, callback) => agent({
    uri: `${baseUri}${resource.base}${resource.create.uri}`,
    operationName: 'create',
    resource,
    payload,
    callback,
  })
  .then(onResponse)

  Mutator.list = (callback) => agent({
    uri: `${baseUri}${resource.base}${resource.list.uri}`,
    operationName: 'list',
    resource,
    callback,
  })
  .then(onResponse)

  return Mutator

}

export default ({getResources, props, base, agent, onResponse}) => {

  const baseUri = base || ''

  let mutator = {}
  let resources = getResources({props})

  for (let key in resources) {

    mutator[key] = createMutator({
      agent,
      key,
      getResources,
      props,
      baseUri,
      onResponse,
    })

  }

  return mutator
}