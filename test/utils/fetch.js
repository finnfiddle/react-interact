import _ from 'lodash'
import test from 'blue-tape'

import RequestFactory from '../requestFactory'
import agent from '../mock/agent'
import { fetch, normalizeResource } from '../../source/utils'

const BASE = '/test'
const ITEM_URI = '/test_id'
const KEY = 'testResource'

test('fetch: default', function (t) {

  const request = RequestFactory({
    operationName: 'list',
    baseUri: BASE,
    itemUri: ITEM_URI,
    name: KEY,
  })

  const expected = {
    [KEY]: {
      uri: BASE,
      method: 'GET',
    },
  }

  const resources = {
    [KEY]: normalizeResource(BASE),
  }

  return fetch.call({resources, agent})
    .then(actual => {
      t.deepEqual(actual, expected)
    })

})
