export const OPERATIONS = [
  {name: 'list', defaultMethod: 'GET'},
  {name: 'create', defaultMethod: 'POST'},
  {name: 'read', defaultMethod: 'GET'},
  {name: 'patch', defaultMethod: 'PATCH'},
  {name: 'update', defaultMethod: 'PUT'},
  {name: 'remove', defaultMethod: 'DELETE'},
]

export const RESOURCE_DEFAULTS = {
  defaultOperation: 'list',
  uid: 'id',
  base: '',
  list: '',
  create: '',
}
