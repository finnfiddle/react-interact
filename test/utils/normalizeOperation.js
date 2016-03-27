import test from 'blue-tape'

import { normalizeOperation } from '../../source/utils'

test('normalizeOperation: operation not set on resource', t => {
  t.plan(1)

  const resource = {
    read: undefined,
  }

  const actualOperation = normalizeOperation({
    resource,
    operationName: 'read',
    defaultMethod: 'GET',
  })

  t.equal(typeof actualOperation, 'undefined')

  t.end()
})

test('normalizeOperation: from string', t => {
  t.plan(1)

  const resource = {
    read: '/test_uri',
  }

  const actualOperation = normalizeOperation({
    resource,
    operationName: 'read',
    defaultMethod: 'GET',
  })

  const expectedOperation = {
    method: 'GET',
    uri: '/test_uri',
  }

  t.deepEqual(actualOperation, expectedOperation)

  t.end()
})

test('normalizeOperation: from object', t => {
  t.plan(1)

  const resource = {
    read: {method: 'TEST_METHOD', uri: '/test_uri'},
  }

  const actualOperation = normalizeOperation({
    resource,
    operationName: 'read',
    defaultMethod: 'GET',
  })

  const expectedOperation = {
    method: 'TEST_METHOD',
    uri: '/test_uri',
  }

  t.deepEqual(actualOperation, expectedOperation)

  t.end()
})
