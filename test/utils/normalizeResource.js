import test from 'blue-tape'

import { normalizeResource, noop } from '../../source/utils'

const BASE = '/test'
const ITEM_URI = '/${id}'

test('normalizeResource: from baseUri string', t => {
  t.plan(1)

  const actual = normalizeResource(BASE)

  const expected = {
    defaultOperation: 'list',
    base: BASE,
    headers: {},
    list: { method: 'GET', uri: '' },
    create: { method: 'POST', uri: '' },
    read: { method: 'GET', uri: ITEM_URI },
    update: { method: 'PUT', uri: ITEM_URI },
    patch: { method: 'PATCH', uri: ITEM_URI },
    remove: { method: 'DELETE', uri: ITEM_URI },
    uid: 'id',
    isResource: true,
    onFailure: noop,
    onSuccess: noop,
    onRequest: noop,
  }

  delete actual.getUri
  delete actual.getMethod
  delete actual.getBase

  t.deepEqual(actual, expected)
  t.end()

})

test('normalizeResource: from item config', t => {
  t.plan(1)

  const actual = normalizeResource({
    base: BASE,
    item: ITEM_URI,
  })

  const expected = {
    defaultOperation: 'list',
    base: BASE,
    headers: {},
    list: { method: 'GET', uri: '' },
    create: { method: 'POST', uri: '' },
    read: { method: 'GET', uri: ITEM_URI },
    update: { method: 'PUT', uri: ITEM_URI },
    patch: { method: 'PATCH', uri: ITEM_URI },
    remove: { method: 'DELETE', uri: ITEM_URI },
    uid: 'id',
    isResource: true,
    onFailure: noop,
    onSuccess: noop,
    onRequest: noop,
  }

  delete actual.getUri
  delete actual.getMethod
  delete actual.getBase

  t.deepEqual(actual, expected)
  t.end()

})

test('normalizeResource: from item string', t => {
  t.plan(1)

  const actual = normalizeResource({
    base: BASE,
    read: ITEM_URI,
  })

  const expected = {
    defaultOperation: 'list',
    base: BASE,
    headers: {},
    list: { method: 'GET', uri: '' },
    create: { method: 'POST', uri: '' },
    read: { method: 'GET', uri: ITEM_URI },
    update: undefined,
    patch: undefined,
    remove: undefined,
    uid: 'id',
    isResource: true,
    onFailure: noop,
    onSuccess: noop,
    onRequest: noop,
  }

  delete actual.getUri
  delete actual.getMethod
  delete actual.getBase

  t.deepEqual(actual, expected)
  t.end()

})

test('normalizeResource: headers', t => {
  t.plan(1)

  const actual = normalizeResource({
    base: BASE,
    item: ITEM_URI,
    headers: {
      foo: 'bar',
    },
  })

  const expected = {
    defaultOperation: 'list',
    base: BASE,
    headers: {foo: 'bar'},
    list: { method: 'GET', uri: '' },
    create: { method: 'POST', uri: '' },
    read: { method: 'GET', uri: ITEM_URI },
    update: { method: 'PUT', uri: ITEM_URI },
    patch: { method: 'PATCH', uri: ITEM_URI },
    remove: { method: 'DELETE', uri: ITEM_URI },
    uid: 'id',
    isResource: true,
    onFailure: noop,
    onSuccess: noop,
    onRequest: noop,
  }

  delete actual.getUri
  delete actual.getMethod
  delete actual.getBase

  t.deepEqual(actual, expected)
  t.end()

})
