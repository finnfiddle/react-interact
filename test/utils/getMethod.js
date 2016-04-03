import test from 'blue-tape'

import { getMethod } from '../../source/utils'

const OPERATION_NAME = 'read'
const METHOD = 'TEST'

test('getMethod: default', t => {
  t.plan(1)

  const actual = getMethod.call(
    {
      defaultOperation: OPERATION_NAME,
      [OPERATION_NAME]: {method: METHOD},
    },
    {}
  )

  const expected = METHOD

  t.deepEqual(actual, expected)
  t.end()

})

test('getMethod: nondefault', t => {
  t.plan(1)

  const actual = getMethod.call(
    {
      [OPERATION_NAME]: {method: METHOD},
    },
    {
      operationName: OPERATION_NAME,
    }
  )

  const expected = METHOD

  t.deepEqual(actual, expected)
  t.end()

})
