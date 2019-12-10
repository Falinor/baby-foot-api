import uuid from 'uuid/v4'

const find = matchStore => async () => Object.values(matchStore)

const create = matchStore => async match => {
  match.id = uuid()
  matchStore[match.id] = match
  return match
}

export const createMemoryRepository = () => {
  const matchStore = []
  return {
    find: find(matchStore),
    create: create(matchStore)
  }
}

export default createMemoryRepository
