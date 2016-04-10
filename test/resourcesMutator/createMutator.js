import test from 'blue-tape'

import agent from '../mock/agent'
import { createMutator } from '../../source/resourcesMutator'
import { normalizeResource } from '../../source/utils'

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
        uri: `${BASE}/1`,
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

  return mutator({id: 1}).update(PAYLOAD, CALLBACK)

})

test('createMutator: READ', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}/1`,
        payload: undefined,
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

  return mutator({id: 1}).read(CALLBACK)

})

test('createMutator: REMOVE', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'DELETE',
        uri: `${BASE}/1`,
        payload: undefined,
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

  return mutator({id: 1}).remove(CALLBACK)

})

test('createMutator: LIST', t => {

  let expected = {
    response: {
      body: {
        callback: CALLBACK,
        method: 'GET',
        uri: `${BASE}`,
        payload: undefined,
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
        uri: `${BASE}/1${SUB_BASE}`,
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

  return mutator({id: 1}).testSubResource.create(PAYLOAD, CALLBACK)

})

test('createMutator: SUB UPDATE', t => {

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
        meta: {
          operationName: 'update',
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

  return mutator({id: 1})
    .testSubResource({id: 2})
    .update(PAYLOAD, CALLBACK)

})

test('createMutator: FETCH multiple', t => {

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
        meta: {
          operationName: 'fetch',
          resource,
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

  return mutator.fetch(CALLBACK)

})

test('createMutator: FETCH single', t => {

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
        meta: {
          operationName: 'fetch_item',
          resource,
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

  return mutator({id: 1}).fetch(CALLBACK)

})
