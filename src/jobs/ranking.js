import Elo from 'arpad'
import Queue from 'bull'
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

queue.process(async (job) => {
  logger.info(`Processing job ${job}`)
  const match = job.data
  const teamRepository = container.resolve('teamRepository')
  const playerRepository = container.resolve('playerRepository')

  try {
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

    await Promise.all([
      ...winner.players.map((p, i) =>
        playerRepository.update({
          ...p,
          wins: (p.wins ?? 0) + 1,
          rank: winnerNewRanks[i]
        })
      ),
      ...loser.players.map((p, i) =>
        playerRepository.update({
          ...p,
          losses: (p.losses ?? 0) + 1,
          rank: loserNewRanks[i]
        })
      ),
      teamRepository.update({
        id: winner.id,
        wins: (winner.wins ?? 0) + 1,
        rank: average(winnerNewRanks)
      }),
      teamRepository.update({
        id: loser.id,
        losses: (loser.losses ?? 0) + 1,
        rank: average(loserNewRanks)
      })
    ])
    logger.info('Treated job for match', match.id)
    await job.moveToCompleted(match)
  } catch (err) {
    await job.moveToFailed(err)
  }
})

const ranks = (team) => team.players.map((p) => p.rank ?? 1000)

const sum = (numbers) => numbers.reduce((a, b) => a + b, 0)

const average = (numbers) => sum(numbers) / numbers.length