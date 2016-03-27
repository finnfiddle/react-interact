import agent from 'superagent'
import { isSet } from './utils'
import { Promise } from 'es6-promise'

const VERBS_AS_METHODS = {
  POST: 'post',
  GET: 'get',
  PUT: 'put',
  DELETE: 'del',
  PATCH: 'patch',
}

export default (request) => new Promise((resolve, reject) => {

  const requestMethod = VERBS_AS_METHODS[request.method]
  let req = agent[requestMethod](request.uri)

  if (
    ['POST', 'PUT', 'PATCH'].indexOf(request.method) > -1 &&
    isSet(request.payload)
  ) req.send(request.payload)

  req.end((err, response) => {
    if (isSet(err)) reject(err)
    else if (!response.ok) reject(response.body)
    else resolve({request, response})
  })

})
