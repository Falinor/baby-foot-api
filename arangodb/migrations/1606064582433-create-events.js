const { database } = require('../db')

const EVENTS = 'events'

module.exports.up = async () => {
  const db = database()
  const collectionExists = await db.collection(EVENTS).exists()
  if (!collectionExists) {
    await db.createCollection(EVENTS)
  }
}

module.exports.down = async () => {
  const db = database()
  const players = db.collection(EVENTS)
  await players.drop()
}
