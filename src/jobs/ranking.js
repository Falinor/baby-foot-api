import Elo from 'arpad'
import Queue from 'bull'
import http from 'axios'

import { maxBy, minBy } from 'lodash'

import { createContainer } from '../container'
import { config, logger } from '../core'

const UCSF = {
  default: 32,
  2100: 24,
  2400: 16
}
const MIN = 100
const MAX = 10000

const container = createContainer()
const queue = new Queue('ranking', config.redis)

logger.info('Ranking job started')

queue.process(async (job) => {
  try {
    logger.info(`Processing job ${job}`)
    const match = job.data
    const teamRepository = container.resolve('teamRepository')
    const playerRepository = container.resolve('playerRepository')

    const winner = maxBy(match.teams, 'points')
    const loser = minBy(match.teams, 'points')
    const elo = new Elo(UCSF, MIN, MAX)

    logger.debug(winner, loser)

    const winnerNewRanks = winner.players.map((p) =>
      elo.newRatingIfWon(p.rank ?? 1000, average(ranks(loser)))
    )
    const loserNewRanks = loser.players.map((p) =>
      elo.newRatingIfLost(p.rank ?? 1000, average(ranks(winner)))
    )

    logger.debug(winnerNewRanks, loserNewRanks)

    // Save new ranks
    await Promise.all([
      ...winner.players.map((p, i) =>
        playerRepository.update(p.id, {
          wins: (p.wins ?? 0) + 1,
          rank: winnerNewRanks[i]
        })
      ),
      ...loser.players.map((p, i) =>
        playerRepository.update(p.id, {
          losses: (p.losses ?? 0) + 1,
          rank: loserNewRanks[i]
        })
      ),
      teamRepository.update(winner.id, {
        wins: (winner.wins ?? 0) + 1,
        rank: average(winnerNewRanks)
      }),
      teamRepository.update(loser.id, {
        losses: (loser.losses ?? 0) + 1,
        rank: average(loserNewRanks)
      })
    ])

    // Send new ranks to the Battlemythe API
    const toBattlemytheScore = (newRanks) => (player, i) => ({
      userId: player.id,
      elo: newRanks[i]
    })
    const winnerScores = winner.players.map(toBattlemytheScore(winnerNewRanks))
    const loserScores = loser.players.map(toBattlemytheScore(loserNewRanks))
    await http.post(`${config.battlemythe.api}/attractions/babyfoot/score`, {
      userId: config.battlemythe.username,
      password: config.battlemythe.password,
      scores: [...winnerScores, ...loserScores]
    })
    logger.info('Scores sent to the Battlemythe API')
    logger.info(`Treated job for match ${match.id}`)
    logger.debug('End job ranking')
  } catch (err) {
    logger.error(err)
  }
})

const ranks = (team) => team.players.map((p) => p.rank ?? 1000)

const sum = (numbers) => numbers.reduce((a, b) => a + b, 0)

const average = (numbers) => sum(numbers) / numbers.length
