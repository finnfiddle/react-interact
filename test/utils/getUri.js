import test from 'blue-tape'

import { getUri } from '../../source/utils'

const BASE = '/api/v1'
const PARENT_BASE = '/parent_base'
const PROPS = {
  abc: 'yessir',
  xyz: 'yup',
}
const ID = 'this_is_the_id'

test('getUri: no base', t => {
  t.plan(1)

  const actual = getUri.call(
    {
      defaultOperation: 'list',
      list: {uri: '/list/${id}/abc/${props.abc}/xyz/${props.xyz}'},
    },
    {
      id: ID,
      props: PROPS,
    }
  )

  const expected = `/list/${ID}/abc/${PROPS.abc}/xyz/${PROPS.xyz}`

  t.deepEqual(actual, expected)
  t.end()

})

test('getUri: base', t => {
  t.plan(1)

  const actual = getUri.call(
    {
      base: BASE,
      defaultOperation: 'list',
      list: {uri: '/list/${id}/abc/${props.abc}/xyz/${props.xyz}'},
    },
    {
      id: ID,
      props: PROPS,
    }
  )

  const expected = `${BASE}/list/${ID}/abc/${PROPS.abc}/xyz/${PROPS.xyz}`

  t.deepEqual(actual, expected)
  t.end()

})

test('getUri: parentBase', t => {
  t.plan(1)

  const actual = getUri.call(
    {
      base: BASE,
      parentBase: PARENT_BASE,
      defaultOperation: 'list',
      list: {uri: '/list/${id}/abc/${props.abc}/xyz/${props.xyz}'},
    },
    {
      id: ID,
      props: PROPS,
    }
  )

  const expected = `${PARENT_BASE}${BASE}/list/${ID}/abc/${PROPS.abc}/xyz/${PROPS.xyz}`

  t.deepEqual(actual, expected)
  t.end()

})
