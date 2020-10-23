import createRouter from 'koa-joi-router'

export function createTeamRouter({ teamController }) {
  const router = createRouter().get('/v1/teams', teamController.index)
  return router.middleware()
}
