import { map as asyncMap } from 'nimble'
import { isSet } from './utils'

export default function ({ props }) {

  let result = {}

  return new Promise((resolve, reject) => {
    asyncMap(this.resources, (resource, key, next) => {
      if (!isSet(resource.defaultOperation) || !resource.isResource) {
        next()
      }
      else {
        resource.onRequest({
          uri: resource.getUri({props}),
          method: resource.getMethod({}),
          headers: resource.headers,
        })

        this.agent.call(this, {
          uri: resource.getUri({props}),
          method: resource.getMethod({}),
          headers: resource.headers,
        })

        .then(({ response }) => {
          resource.onSuccess({
            uri: resource.getUri({props}),
            method: resource.getMethod({}),
            headers: resource.headers,
            response,
          })

          result[key] = response.body
          next(null)
        })

        .catch(({ response }) => {
          resource.onFailure({
            uri: resource.getUri({props}),
            method: resource.getMethod({}),
            headers: resource.headers,
            response,
          })
        })
      }

    }, (err) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

}
