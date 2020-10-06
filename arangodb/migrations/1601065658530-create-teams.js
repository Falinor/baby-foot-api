const { db } = require('../db')

const TEAMS = 'teams'

module.exports.up = async () => {
  const collectionExists = await db.collection(TEAMS).exists()
  if (!collectionExists) {
    await db.createCollection(TEAMS)
  }}

module.exports.down = async () => {
  const players = db.collection(TEAMS)
  await players.drop()
}
