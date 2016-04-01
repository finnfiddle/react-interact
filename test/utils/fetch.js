import _ from 'lodash'
import test from 'blue-tape'

import { fetch, getNormalizedResources } from '../../source/utils'
import agent from '../mock/agent'

const BASE = '/test'
const ITEM_URI = '/test_id'

test('fetch: default', t => {

  const getResources = () => getNormalizedResources({id: ITEM_URI.slice(1)}, () => ({
    testResource: BASE,
  }))

  const expected = {
    testResource: {
      uri: BASE,
      operationName: 'list',
      resource: {
        defaultOperation: 'list',
        base: BASE,
        list: { method: 'GET', uri: '' },
        create: { method: 'POST', uri: '' },
        select: { uri: ITEM_URI },
        read: { method: 'GET', uri: ITEM_URI },
        update: { method: 'PUT', uri: ITEM_URI },
        patch: { method: 'PATCH', uri: ITEM_URI },
        remove: { method: 'DELETE', uri: ITEM_URI },
        name: 'testResource',
      },
    },
  };

  return fetch({params: {}, getResources, agent})
    .then(actual => t.deepEqual(actual, expected))

})
