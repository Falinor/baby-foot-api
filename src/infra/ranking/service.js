import Queue from 'bull'

import { config } from '../../core'

const updateRanks = (queue) => (match) => queue.add(match)

export function createRankingService() {
  const queue = new Queue('ranking', config.redis)
  return {
    updateRanks: updateRanks(queue)
  }
}
