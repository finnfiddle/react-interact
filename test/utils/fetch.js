import test from 'blue-tape'

import agent from '../mock/agent'
import { normalizeResource } from '../../source/utils'
import fetch from '../../source/fetch'

const BASE = '/test'
const KEY = 'testResource'

test('fetch: default', function (t) {

  const expected = {
    [KEY]: {
      headers: {},
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
