import test from 'blue-tape'

import { normalizeResource } from '../../source/utils'

test('normalizeResource: from baseUri string', t => {
  t.plan(1)

  const BASE = '/test'
  const ITEM_URI = '/test_id'

  const actual = normalizeResource(BASE, {id: 'test_id'})

  const expected = {
    defaultOperation: 'list',
    base: BASE,
    list: { method: 'GET', uri: '' },
    create: { method: 'POST', uri: '' },
    select: { uri: ITEM_URI },
    read: { method: 'GET', uri: ITEM_URI },
    update: { method: 'PUT', uri: ITEM_URI },
    patch: { method: 'PATCH', uri: ITEM_URI },
    remove: { method: 'DELETE', uri: ITEM_URI },
  }

  t.deepEqual(actual, expected)
  t.end()

})
