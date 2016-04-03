import test from 'blue-tape'

import { normalizeResource, getUri, getMethod } from '../../source/utils'

test('normalizeResource: from baseUri string', t => {
  t.plan(1)

  const BASE = '/test'
  const ITEM_URI = '/${id}'

  const actual = normalizeResource(BASE)

  const expected = {
    defaultOperation: 'list',
    base: BASE,
    list: { method: 'GET', uri: '' },
    create: { method: 'POST', uri: '' },
    read: { method: 'GET', uri: ITEM_URI },
    update: { method: 'PUT', uri: ITEM_URI },
    patch: { method: 'PATCH', uri: ITEM_URI },
    remove: { method: 'DELETE', uri: ITEM_URI },
  }

  delete actual.getUri
  delete actual.getMethod

  t.deepEqual(actual, expected)
  t.end()

})
