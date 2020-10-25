import createRouter from 'koa-joi-router'

import playerSchemas from './schemas'

export function createPlayerRouter({ playerController }) {
  const router = createRouter()
    .route({
      method: 'get',
      path: '/v1/players',
      validate: playerSchemas.index,
      handler: playerController.index
    })
    .get('/v1/players/:id', playerController.show)
  return router.middleware()
}
