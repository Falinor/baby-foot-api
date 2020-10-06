import createRouter from 'koa-joi-router'

import matchSchemas from './schemas'

export function createMatchRouter({ matchController }) {
  const router = createRouter()
    .get('/v1/matches', matchController.index)
    .route({
      method: 'post',
      path: '/v1/matches',
      validate: matchSchemas.create,
      handler: matchController.create
    })

  return router.middleware()
}
