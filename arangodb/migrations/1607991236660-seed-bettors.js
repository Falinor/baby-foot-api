const http = require('got')

const { database } = require('../db')

const BETTORS = 'bettors'

// TODO: replace by a call to the real config
const config = {
  battlemythe:
    process.env.BATTLEMYTHE_API ?? 'https://battlemythe.net/api/anniv/2020'
}

module.exports.up = async () => {
  const db = database()
  const users = await http
    .get(`${config.battlemythe}/users`, {
      responseType: 'json'
    })
    .json()
  const players = users.map(toPlayer)
  await db.collection(BETTORS).saveAll(players)
}

module.exports.down = async () => {
  const db = database()
  await db.collection(BETTORS).truncate()
}

const toPlayer = (user) => ({
  _key: user._id,
  email: user.email,
  nickname: user.username,
  points: 300
})
