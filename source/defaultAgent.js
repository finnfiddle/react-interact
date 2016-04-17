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

  const { method, headers, uri, payload } = request

  const requestMethod = VERBS_AS_METHODS[method]
  let req = agent[requestMethod](uri).set(headers || {})

  if (
    ['POST', 'PUT', 'PATCH'].indexOf(method) > -1 &&
    isSet(payload)
  ) req.send(payload)

  req.end((err, response) => {
    console.log({err, response})
    if (!response.ok) reject({request, response})
    else resolve({request, response})
  })

})
