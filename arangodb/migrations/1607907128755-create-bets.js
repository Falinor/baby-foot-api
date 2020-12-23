const { database } = require('../db')

const BETS = 'bets'

module.exports.up = async () => {
  const db = database()
  const collectionExists = await db.collection(BETS).exists()
  if (!collectionExists) {
    await db.createCollection(BETS)
  }
}

module.exports.down = async () => {
  const db = database()
  const players = db.collection(BETS)
  await players.drop()
}
