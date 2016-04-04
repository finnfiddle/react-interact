import test from 'blue-tape'

import { getUri, getBase } from '../../source/utils'

const BASE = '/api/v1'
const PARENT_BASE = '/parent_base'
const PROPS = {
  abc: 'yessir',
  xyz: 'yup',
}
const ID = 'this_is_the_id'

test('getUri: no base', t => {
  t.plan(1)

  let container = {
    getBase,
    defaultOperation: 'list',
    list: {uri: '/list/${id}/abc/${props.abc}/xyz/${props.xyz}'},
  }

  container.getBase = getBase.bind(container)

  const actual = getUri.call(container, {
    id: ID,
    props: PROPS,
  })

  const expected = `/list/${ID}/abc/${PROPS.abc}/xyz/${PROPS.xyz}`

  t.deepEqual(actual, expected)
  t.end()

})

test('getUri: base', t => {
  t.plan(1)

  let container = {
    base: BASE,
    defaultOperation: 'list',
    list: {uri: '/list/${id}/abc/${props.abc}/xyz/${props.xyz}'},
  }

  container.getBase = getBase.bind(container)

  const actual = getUri.call(container, {
    id: ID,
    props: PROPS,
  })

  const expected = `${BASE}/list/${ID}/abc/${PROPS.abc}/xyz/${PROPS.xyz}`

  t.deepEqual(actual, expected)
  t.end()

})

test('getUri: parentBase', t => {
  t.plan(1)

  let container = {
    base: BASE,
    getBase,
    parentBase: PARENT_BASE,
    defaultOperation: 'list',
    list: {uri: '/list/${id}/abc/${props.abc}/xyz/${props.xyz}'},
  }

  container.getBase = getBase.bind(container)

  const actual = getUri.call(container, {
    id: ID,
    props: PROPS,
  })

  const expected = `${PARENT_BASE}${BASE}/list/${ID}/abc/${PROPS.abc}/xyz/${PROPS.xyz}`

  t.deepEqual(actual, expected)
  t.end()

})
