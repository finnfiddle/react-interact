export default function({ key }) {

  let nonResource = this.resources[key]
  let { uri, method, headers } = nonResource
  method = method || 'GET'
  headers = headers || {}

  const sendRequest = ({ payload, callback }) => {
    nonResource.onRequest({uri, method, headers})
    this.agent.call(this,
      Object.assign({}, nonResource, {payload, callback, meta: {resource: nonResource}})
    )
    .then(({ response, request }) => {
      nonResource.onSuccess({uri, method, headers, response})
      this.handleResponse.call(this, {response, request})
      return
    })
    .catch(({ response, request }) => {
      nonResource.onFailure({uri, method, headers, response})
      // this.handleResponse.call(this, {response, request})
      return
    })
  }

  if (['POST', 'PUT'].indexOf(nonResource.method) > -1) {
    return (payload, callback) => sendRequest({payload, callback})
  } else {
    return (callback) => sendRequest({callback})
  }

}
