import test from 'blue-tape'

import agent from '../mock/agent'
import RequestFactory from '../requestFactory'
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

  const expected = RequestFactory({
    operationName: 'create',
    payload: PAYLOAD,
    baseUri: BASE,
    name: KEY,
  })

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      onResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator.create(PAYLOAD, CALLBACK)

})

test('createMutator: UPDATE', t => {

  const expected = RequestFactory({
    operationName: 'update',
    itemUri: ITEM_URI,
    payload: PAYLOAD,
    baseUri: BASE,
    name: KEY,
  })

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      onResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).update(PAYLOAD, CALLBACK)

})

test('createMutator: READ', t => {

  const itemUri = 123
  const expected = RequestFactory({
    operationName: 'read',
    itemUri: ITEM_URI,
    baseUri: BASE,
    name: KEY,
  })

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      onResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).read(CALLBACK)

})

test('createMutator: REMOVE', t => {

  const expected = RequestFactory({
    operationName: 'remove',
    itemUri: ITEM_URI,
    baseUri: BASE,
    name: KEY,
  })

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      onResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).remove(CALLBACK)

})

test('createMutator: LIST', t => {

  const expected = RequestFactory({
    operationName: 'list',
    baseUri: BASE,
    name: KEY,
  })

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const mutator = createMutator.call(
    {
      agent,
      resources,
      props: PROPS,
      onResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator.list(CALLBACK)

})

test('createMutator: SUB CREATE', t => {

  const expected = RequestFactory({
    operationName: 'create',
    payload: PAYLOAD,
    baseUri: `${BASE}${ITEM_URI}${SUB_BASE}`,
    name: KEY,
  })

  const onResponse = (actual) => {
    t.deepEqual(actual, expected)
  }

  const resource = normalizeResource({
    base: BASE,
    item: ITEM_URI,
    subs: {
      [SUB_KEY]: normalizeResource(SUB_BASE),
    },
  })

  const mutator = createMutator.call(
    {
      agent,
      resources: {
        [KEY]: resource,
      },
      props: PROPS,
      onResponse,
    },
    {
      key: KEY,
    }
  )

  return mutator(ITEM_URI.slice(1)).testSubResource.create(PAYLOAD, CALLBACK)

})
