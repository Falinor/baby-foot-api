const { db } = require('../db')

const MATCHES = 'matches'

module.exports.up = async () => {
  const collectionExists = await db.collection(MATCHES).exists()
  if (!collectionExists) {
    await db.createCollection(MATCHES)
  }}

module.exports.down = async () => {
  const players = db.collection(MATCHES)
  await players.drop()
}
