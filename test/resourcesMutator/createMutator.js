import test from 'blue-tape'

import agent from '../mock/agent'
import { createMutator } from '../../source/resourcesMutator'
import { getNormalizedResources } from '../../source/utils'

const BASE = '/test'
const ITEM_URI = '/test_id'
const KEY = 'testResource'
const PAYLOAD = {foo: 'bar'}
const CALLBACK = () => ({fooo: 'bar'})
const PROPS = {}

const getExpected = (operationName, itemUri, payload) => {
  const result = {
    request: {
      uri: `${BASE}${['update', 'remove', 'read']
        .indexOf(operationName) > -1 ? itemUri : ''}`,
      operationName,
      resource: {
        defaultOperation: 'list',
        base: BASE,
        list: {
          method: 'GET',
          uri: '',
        },
        create: {
          method: 'POST',
          uri: '',
        },
        select: {
          uri: itemUri,
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
        name: KEY,
      },
      callback: CALLBACK,
    },
    response: {
      body: {
        uri: `${BASE}${['update', 'remove', 'read']
          .indexOf(operationName) > -1 ? itemUri : ''}`,
        operationName,
        resource: {
          defaultOperation: 'list',
          base: BASE,
          list: {
            method: 'GET',
            uri: '',
          },
          create: {
            method: 'POST',
            uri: '',
          },
          select: {
            uri: itemUri,
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
          name: KEY,
        },
        callback: CALLBACK,
      },
    },
  }

  if (typeof payload !== 'undefined') {
    result.request.payload = result.response.body.payload = payload
  }

  return result
}

const getResources = ({ id, props }) => {
  return getNormalizedResources({id, props}, () => ({
    testResource: BASE,
  }))
}

test('createMutator: CREATE', t => {

  const expected = getExpected('create', `/${undefined}`, PAYLOAD)

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator({
    agent,
    key: KEY,
    getResources,
    props: PROPS,
    onResponse,
  })

  return mutator.create(PAYLOAD, CALLBACK)

})

test('createMutator: UPDATE', t => {

  const itemUri = 123
  const expected = getExpected('update', `/${itemUri}`, PAYLOAD)

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator({
    agent,
    key: KEY,
    getResources,
    props: PROPS,
    onResponse,
  })

  return mutator(itemUri).update(PAYLOAD, CALLBACK)

})

test('createMutator: READ', t => {

  const itemUri = 123
  const expected = getExpected('read', `/${itemUri}`)

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator({
    agent,
    key: KEY,
    getResources,
    props: PROPS,
    onResponse,
  })

  return mutator(itemUri).read(CALLBACK)

})

test('createMutator: REMOVE', t => {

  const itemUri = 123
  const expected = getExpected('remove', `/${itemUri}`)

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator({
    agent,
    key: KEY,
    getResources,
    props: PROPS,
    onResponse,
  })

  return mutator(itemUri).remove(CALLBACK)

})

test('createMutator: LIST', t => {

  const itemUri = 123
  const expected = getExpected('list', `/${undefined}`)

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator({
    agent,
    key: KEY,
    getResources,
    props: PROPS,
    onResponse,
  })

  return mutator.list(CALLBACK)

})
