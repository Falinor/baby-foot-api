const { database } = require('../db')

const PLAYERS = 'players'

module.exports.up = async () => {
  const db = database()
  const collectionExists = await db.collection(PLAYERS).exists()
  if (!collectionExists) {
    await db.createCollection(PLAYERS)
  }
}

module.exports.down = async () => {
  const db = database()
  const players = db.collection(PLAYERS)
  await players.drop()
}
