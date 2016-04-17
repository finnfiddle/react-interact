import cloneDeep from 'lodash.clonedeep'
import findIndex from 'lodash.findindex'
import { isSet } from './utils'

export default ({ currentData, response, request }) => {

  return new Promise(resolve => {
    let data = cloneDeep(currentData)
    const { resource, operationName } = request.meta
    const uid = resource.uid
    const { body } = response

    const updateItem = (collection, newItemData) => {
      let item = collection.filter(d => d[uid] === newItemData[uid])[0]
      if (isSet(item)) Object.assign(item, newItemData)
    }

    switch (operationName) {
      case 'create':
        data.push(body)
        break
      case 'patch':
      case 'update':
      case 'fetch_item':
        updateItem(data, body)
        break
      case 'remove':
        const index = findIndex(data, {[uid]: body[uid]})
        data.splice(index, 1)
        break
      case 'fetch':
        data.length = 0
        Array.prototype.push.apply(data, body)
        break
      default:
        break
    }

    resolve(data)
  })
}
