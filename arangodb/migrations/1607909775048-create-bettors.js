const { database } = require('../db')

const BETTORS = 'bettors'

module.exports.up = async () => {
  const db = database()
  const collectionExists = await db.collection(BETTORS).exists()
  if (!collectionExists) {
    await db.createCollection(BETTORS)
  }
}

module.exports.down = async () => {
  const db = database()
  const players = db.collection(BETTORS)
  await players.drop()
}
