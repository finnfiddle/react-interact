import test from 'blue-tape'
import React from 'react'
import { createContainer, resource } from '../source/index'

const Container = createContainer(<div />, {
  test: {
    base: 'test',
    item: '/1',
  }
})

const validResource = {
  base: 'test',
  list: '',
  defaultOperation: 'list',
  uid: 'id',
  read: '/1',
  create: '/1',
  update: '/1',
  remove: '/1',
}

test('_handleResponse()', (t) => {
    const container = {}

    container._handleResponse = Container
      .compose
      .methods
      ._handleResponse
      .bind(container)

    container.state = {test: {}}

    container.setState = (newState) => container.state = newState

    container._mergeResponse = (mergeData) =>
      t.equal()
      console.log(mergeData)

    container._handleResponse({
      resource: validResource,
      resourceName: 'test',
      operationName: 'list',
      // callback: () => console.log("blah"),
    })(null, {body: {foo: 'bar'}})


  t.end()
})

// test('handleRequest()', t => {
//
//   container.getResources =
//
//   container._getRequest = (result) => {
//     this._getRequestResult = result
//     return {
//       end: (cb) => cb()
//     }
//   }
//
//   container._handleResponse = (result) => {
//     this._handleResponseResult = result
//     return () => this.didEnd = true
//   }
//
//   container.props = {}
//
//   // let container = MockContainer
//   console.log(container)
//   container.handleRequest('test', 'create', {foo: 'bar'}, function callback() {
//
//   })
//
//   t.plan(0)
//   t.end()
// })
