const get = (db) => async (id) => {
  const bettorCollection = db.collection('bettors')
  const bettor = await bettorCollection.document(
    { _key: id },
    { graceful: true }
  )
  return bettor ? fromDatabase(bettor) : null
}

const create = (db) => async (bettor) => {
  const bettorCollection = db.collection('bettors')
  await bettorCollection.save(toDatabase(bettor))
}

const update = (db) => async (id, bettor) => {
  const bettorCollection = db.collection('bettors')
  await bettorCollection.update({ _key: id }, bettor)
}

export const fromDatabase = (bettorEntity) => ({
  id: bettorEntity._key,
  nickname: bettorEntity.nickname,
  points: bettorEntity.points
})

export const toDatabase = (bettor) => ({
  _key: bettor.id,
  nickname: bettor.nickname,
  points: bettor.points
})

export const createBettorArangoRepository = ({ db }) => ({
  get: get(db),
  create: create(db),
  update: update(db)
})
