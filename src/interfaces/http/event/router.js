import createRouter from 'koa-joi-router'

import eventSchemas from './schemas'

export function createEventRouter({ eventController }) {
  const router = createRouter().get('/v1/events', eventController.index).route({
    method: 'POST',
    path: '/v1/events',
    validate: eventSchemas.create,
    handler: eventController.create
  })
  return router.middleware()
}
