import test from 'blue-tape'

import agent from './mock/agent'
import createResourceMutator from '../source/createResourceMutator'
import { normalizeResource } from '../source/utils'

const BASE = '/test'
const ITEM_URI = '/${id}'
const SUB_BASE = '/sub_test'
const SUB_ITEM_URI = '/${id}'
const KEY = 'testResource'
const SUB_KEY = 'testSubResource'
const PAYLOAD = {foo: 'bar'}
const CALLBACK = () => ({fooo: 'bar'})
const PROPS = {}

const resources = {
  [KEY]: normalizeResource(BASE),
}

test('Mutator: CREATE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'POST',
        payload: PAYLOAD,
        uri: `${BASE}`,
        headers: {},
        meta: {
          operationName: 'create',
          resource: resources[KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

test('Mutator: UPDATE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'PUT',
        payload: PAYLOAD,
        uri: `${BASE}/1`,
        headers: {},
        meta: {
          operationName: 'update',
          resource: resources[KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator({id: 1}).update(PAYLOAD, CALLBACK)

})

test('Mutator: READ', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}/1`,
        payload: undefined,
        headers: {},
        meta: {
          operationName: 'read',
          resource: resources[KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator({id: 1}).read(CALLBACK)

})

test('Mutator: REMOVE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'DELETE',
        uri: `${BASE}/1`,
        payload: undefined,
        headers: {},
        meta: {
          operationName: 'remove',
          resource: resources[KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator({id: 1}).remove(CALLBACK)

})

test('Mutator: LIST', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}`,
        payload: undefined,
        headers: {},
        meta: {
          operationName: 'list',
          resource: resources[KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

test('Mutator: SUB CREATE', t => {

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
        uri: `${BASE}/1${SUB_BASE}`,
        headers: {},
        meta: {
          operationName: 'create',
          resource: resource.subs[SUB_KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator({id: 1}).testSubResource.create(PAYLOAD, CALLBACK)

})

test('Mutator: SUB UPDATE', t => {

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
        method: 'PUT',
        payload: PAYLOAD,
        uri: `${BASE}/1${SUB_BASE}/2`,
        headers: {},
        meta: {
          operationName: 'update',
          resource: resource.subs[SUB_KEY],
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator({id: 1})
    .testSubResource({id: 2})
    .update(PAYLOAD, CALLBACK)

})

test('Mutator: FETCH multiple', t => {

  const resource = normalizeResource({
    base: BASE,
    item: ITEM_URI,
  })

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}`,
        payload: undefined,
        headers: {},
        meta: {
          operationName: 'fetch',
          resource,
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator.fetch(CALLBACK)

})

test('Mutator: FETCH single', t => {

  const resource = normalizeResource({
    base: BASE,
    item: ITEM_URI,
  })

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}/1`,
        payload: undefined,
        headers: {},
        meta: {
          operationName: 'fetch_item',
          resource,
        },
      },
    },
    request: undefined,
  }

  const handleResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createResourceMutator.call(
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

  return mutator({id: 1}).fetch(CALLBACK)

})
