import createRouter from 'koa-joi-router'

import matchSchemas from './schemas'

export function createMatchRouter({ matchController }) {
  const router = createRouter()
    .get('/v1/matches', matchController.index)
    .route({
      method: 'POST',
      path: '/v1/matches',
      validate: matchSchemas.create,
      handler: matchController.create
    })
    .route({
      method: 'PUT',
      path: '/v1/matches/:id',
      validate: matchSchemas.update,
      handler: matchController.update
    })
    .route({
      method: 'DELETE',
      path: '/v1/matches/:id',
      validate: matchSchemas.remove,
      handler: matchController.remove
    })

  return router.middleware()
}
