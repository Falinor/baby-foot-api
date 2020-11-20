const { database } = require('../db')

const TEAMS = 'teams'

module.exports.up = async () => {
  const db = database()
  const collectionExists = await db.collection(TEAMS).exists()
  if (!collectionExists) {
    await db.createCollection(TEAMS)
  }
}

module.exports.down = async () => {
  const db = database()
  const players = db.collection(TEAMS)
  await players.drop()
}
