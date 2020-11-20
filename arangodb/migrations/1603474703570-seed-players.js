const http = require('got')

const { database } = require('../db')

const PLAYERS = 'players'

// TODO: replace by a call to the real config
const config = {
  battlemytheAPI:
    process.env.BATTLEMYTHE_API_HOST ??
    'https://dev.battlemythe.net/api/anniv/2020'
}

module.exports.up = async () => {
  const db = database()
  const users = await http
    .get(`${config.battlemytheAPI}/users`, {
      responseType: 'json'
    })
    .json()
  const players = users.map(toPlayer)
  await db.collection(PLAYERS).saveAll(players)
}

module.exports.down = async () => {
  const db = database()
  await db.collection(PLAYERS).truncate()
}

const toPlayer = (user) => ({
  _key: user._id,
  email: user.email,
  nickname: user.username,
  wins: 0,
  losses: 0,
  rank: 1000
})
