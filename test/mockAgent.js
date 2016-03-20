import { VERBS_AS_METHODS } from '../source/constants'

let request = {
  get: (url) => {
    let blah = {
      end: (cb) => {
        cb(null, 'resp')
      }
    }
    setTimeout(() => blah.end(), 1000)
    return blah
  }
}

export default {
  request: ({ operation, resource, data }) => {
    const requestMethod = VERBS_AS_METHODS[operation.method]
    const url = `${resource.base}${operation.uri}`
    let req = request[requestMethod](url)
    if(['POST', 'PUT', 'PATCH'].indexOf(operation.method) > -1) {
      req.send(data.payload)
    }
    return req
  }
}
