const getUri = ({ baseUri, operationName, itemUri }) => {
  return `${baseUri}${['update', 'remove', 'read']
    .indexOf(operationName) > -1 ? itemUri : ''}`
}

export default ({
  baseUri,
  operationName,
  itemUri,
  subs,
  callback,
  name,
}) => {

  const request = {
    defaultOperation: 'list',
    base: baseUri,
    list: {
      method: 'GET',
      uri: '',
    },
    create: {
      method: 'POST',
      uri: '',
    },
    read: {
      method: 'GET',
      uri: itemUri,
    },
    update: {
      method: 'PUT',
      uri: itemUri,
    },
    patch: {
      method: 'PATCH',
      uri: itemUri,
    },
    remove: {
      method: 'DELETE',
      uri: itemUri,
    },
    name,
  }

  if (typeof subs !== 'undefined') {
    request.subs = subs
  }

  if (typeof callback !== 'undefined') {
    request.callback = callback
  }

  return {
    uri: getUri({baseUri, operationName, itemUri}),
    operationName,
    response: {
      body: request,
    },
  }

}
