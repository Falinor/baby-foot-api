const { db } = require('../db')

const PLAYERS = 'players'

module.exports.up = async () => {
  const collectionExists = await db.collection(PLAYERS).exists()
  if (!collectionExists) {
    await db.createCollection(PLAYERS)
  }
}

module.exports.down = async () => {
  const players = db.collection(PLAYERS)
  await players.drop()
}
