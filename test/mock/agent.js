import { Promise } from 'es6-promise'

export default (request) => new Promise(resolve => {
  resolve({
    request,
    response: {
      body: request,
    },
  })
})
