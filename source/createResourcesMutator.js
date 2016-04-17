import createResourceMutator from './createResourceMutator'
import createNonResourceMutator from './createNonResourceMutator'

export default function() {

  let mutator = {}

  for (let key in this.resources) {
    if (this.resources[key].isResource) {
      mutator[key] = createResourceMutator.call(this, {key})
    }
    else {
      mutator[key] = createNonResourceMutator.call(this, {key})
    }
  }

  return mutator
}
