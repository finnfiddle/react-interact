import test from 'blue-tape'

import agent from '../mock/agent'
import { createMutator } from '../../source/resourcesMutator'
import { normalizeResource } from '../../source/utils'

const BASE = '/test'
const ITEM_URI = '/test_id'
const SUB_BASE = '/sub_test'
const SUB_ITEM_URI = '/sub_test_id'
const KEY = 'testResource'
const SUB_KEY = 'testSubResource'
const PAYLOAD = {foo: 'bar'}
const CALLBACK = () => ({fooo: 'bar'})
const PROPS = {}

const resources = {
  [KEY]: normalizeResource(BASE),
}

test('createMutator: CREATE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'POST',
        payload: PAYLOAD,
        uri: `${BASE}`,
        meta: {
          operationName: 'create',
          resource: resources[KEY],
        },
      },
    },
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      handleResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator.create(PAYLOAD, CALLBACK)

})

test('createMutator: UPDATE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'PUT',
        payload: PAYLOAD,
        uri: `${BASE}${ITEM_URI}`,
        meta: {
          operationName: 'update',
          resource: resources[KEY],
        },
      },
    },
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      handleResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).update(PAYLOAD, CALLBACK)

})

test('createMutator: READ', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}${ITEM_URI}`,
        meta: {
          operationName: 'read',
          resource: resources[KEY],
        },
      },
    },
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      handleResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).read(CALLBACK)

})

test('createMutator: REMOVE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'DELETE',
        uri: `${BASE}${ITEM_URI}`,
        meta: {
          operationName: 'remove',
          resource: resources[KEY],
        },
      },
    },
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      handleResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).remove(CALLBACK)

})

test('createMutator: LIST', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}`,
        meta: {
          operationName: 'list',
          resource: resources[KEY],
        },
      },
    },
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      handleResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator.list(CALLBACK)

})

test('createMutator: SUB CREATE', t => {

  const resource = normalizeResource({
    base: BASE,
    item: ITEM_URI,
    subs: {
      [SUB_KEY]: {
        base: SUB_BASE,
        item: SUB_ITEM_URI,
      },
    },
  })

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'POST',
        payload: PAYLOAD,
        uri: `${BASE}${ITEM_URI}${SUB_BASE}`,
        meta: {
          operationName: 'create',
          resource: resource.subs[SUB_KEY],
        },
      },
    },
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources: {
        [KEY]: resource,
      },
      props: PROPS,
      handleResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).testSubResource.create(PAYLOAD, CALLBACK)

})
