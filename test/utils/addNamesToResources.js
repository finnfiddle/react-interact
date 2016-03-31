import test from 'blue-tape'

import { addNamesToResources } from '../../source/utils'

test('addNamesToResources', t => {
  t.plan(1)

  const actual = {
    test1: {},
    test2: {},
  }

  addNamesToResources(actual)

  const expected = {
    test1: {name: 'test1'},
    test2: {name: 'test2'},
  }

  t.deepEqual(actual, expected)
  t.end()

})
