const { database } = require('../db')

const MATCHES = 'matches'

module.exports.up = async () => {
  const db = database()
  const collectionExists = await db.collection(MATCHES).exists()
  if (!collectionExists) {
    await db.createCollection(MATCHES)
  }
}

module.exports.down = async () => {
  const db = database()
  const players = db.collection(MATCHES)
  await players.drop()
}
