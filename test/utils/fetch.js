import test from 'blue-tape'

import agent from '../mock/agent'
import { fetch, normalizeResource } from '../../source/utils'

const BASE = '/test'
const KEY = 'testResource'

test('fetch: default', function (t) {

  const expected = {
    [KEY]: {
      uri: BASE,
      method: 'GET',
    },
  }

  const resources = {
    [KEY]: normalizeResource(BASE),
  }

  return fetch.call({resources, agent}, {})
    .then(actual => {
      t.deepEqual(actual, expected)
    })

})
