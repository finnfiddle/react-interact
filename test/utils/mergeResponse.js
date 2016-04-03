import test from 'blue-tape'

import { mergeResponse } from '../../source/utils'

const CURRENT_DATA = [
  {id: 1, name: 'test1'},
  {id: 2, name: 'test2'},
]

test('mergeResponse: CREATE', t => {

  const currentData = CURRENT_DATA.slice(0)

  const response = {
    body: {id: 3, name: 'test3'},
  }

  const request = {
    meta: {
      operationName: 'create',
      resource: {
        uid: 'id',
      },
    },
  }

  const expected = [
    {id: 1, name: 'test1'},
    {id: 2, name: 'test2'},
    {id: 3, name: 'test3'},
  ]

  return mergeResponse({currentData, response, request})
    .then(actual => t.deepEqual(actual, expected))

})

test('mergeResponse: UPDATE', t => {

  const currentData = CURRENT_DATA.slice(0)

  const response = {
    body: {id: 2, name: 'testXYZ'},
  }

  const request = {
    meta: {
      operationName: 'update',
      resource: {
        uid: 'id',
      },
    },
  }

  const expected = [
    {id: 1, name: 'test1'},
    {id: 2, name: 'testXYZ'},
  ]

  return mergeResponse({currentData, response, request})
    .then(actual => t.deepEqual(actual, expected))

})

test('mergeResponse: REMOVE', t => {

  const currentData = CURRENT_DATA.slice(0)

  const response = {
    body: {id: 2},
  }

  const request = {
    meta: {
      operationName: 'remove',
      resource: {
        uid: 'id',
      },
    },
  }

  const expected = [
    {id: 1, name: 'test1'},
  ]

  return mergeResponse({currentData, response, request})
    .then(actual => t.deepEqual(actual, expected))

})
