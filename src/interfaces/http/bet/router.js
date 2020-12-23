import createRouter from 'koa-joi-router'

import betSchemas from './schemas'

export function createBetRouter({ betController }) {
  const router = createRouter()
    .route({
      method: 'GET',
      path: '/v1/bets',
      validate: betSchemas.index,
      handler: betController.index
    })
    .route({
      method: 'POST',
      path: '/v1/bets',
      validate: betSchemas.create,
      handler: betController.create
    })
    .route({
      method: 'post',
      path: '/v1/bets/:id/takers',
      validate: betSchemas.acceptBet,
      handler: betController.acceptBet
    })
  return router.middleware()
}
