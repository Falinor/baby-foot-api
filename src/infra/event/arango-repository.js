import { aql } from 'arangojs'

const find = (db) => async () => {
  const cursor = await db.query(
    aql`
    FOR event IN events
      SORT event.createdAt DESC
      RETURN event
  `
  )
  return cursor.map(fromDatabase)
}

const create = (db) => async (event) => {
  const eventCollection = db.collection('events')
  await eventCollection.save(toDatabase(event))
  return event
}

const removeAll = (db) => async ({ match }) => {
  await db.query(aql`
    FOR event IN events
      FILTER event.match == ${match}
      REMOVE event IN events
  `)
}

export const fromDatabase = (event) => ({
  id: event._key,
  type: event.type,
  match: event.match,
  team: event.team,
  createdAt: event.createdAt
})

export const toDatabase = (event) => ({
  _key: event.id,
  type: event.type,
  match: event.match,
  team: event.team,
  createdAt: event.createdAt
})

export function createEventArangoRepository({ db }) {
  return {
    find: find(db),
    create: create(db),
    removeAll: removeAll(db)
  }
}
