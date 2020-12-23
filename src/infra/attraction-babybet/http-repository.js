import { config, logger } from '../../core'

const update = ({ http }) => async (id, { points }) => {
  const score = toBattlemytheScore({ id, points })
  await http.post(`${config.battlemythe.api}/attractions/babybet/score`, {
    username: config.battlemythe.username,
    password: config.battlemythe.password,
    scores: [score]
  })
  logger.info('Babybet scores sent to the Battlemythe API')
}

const toBattlemytheScore = ({ id, points }) => ({
  userId: id,
  elo: points
})

export function createBabybetAttractionHttpRepository({ http }) {
  return {
    update: update({ http })
  }
}
