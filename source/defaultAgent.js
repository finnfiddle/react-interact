import request from 'superagent'
import stampit from 'stampit'
import { VERBS_AS_METHODS } from './constants'

export default stampit()
  .methods({
    request: ({ operation, resource, data }) => {
      const requestMethod = VERBS_AS_METHODS[operation.method]
      const url = `${resource.base}${operation.uri}`
      let req = request[requestMethod](url)
      if(['POST', 'PUT', 'PATCH'].indexOf(operation.method) > -1) {
        req.send(data.payload)
      }
      return req
    }
  })
