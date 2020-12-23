import { config, logger } from '../../core'

const end = ({ http }) => async ({
  winnerNewRanks,
  loserNewRanks,
  winner,
  loser
}) => {
  const winnerScores = winner.players.map(toBattlemytheScore(winnerNewRanks))
  const loserScores = loser.players.map(toBattlemytheScore(loserNewRanks))
  await http.post(`${config.battlemythe.api}/attractions/babyfoot/score`, {
    username: config.battlemythe.username,
    password: config.battlemythe.password,
    scores: [...winnerScores, ...loserScores]
  })
  logger.info('Babyfoot scores sent to the Battlemythe API')
}

const toBattlemytheScore = (newRanks) => (player, i) => ({
  userId: player.id,
  elo: newRanks[i]
})

export function createBabyfootAttractionHttpRepository({ http }) {
  return {
    end: end({ http })
  }
}
