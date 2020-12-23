import { created, notFound, ok } from '../../../utils'

const index = (findBetsUseCase) => async (ctx) => {
  const { body, status } = await findBetsUseCase.execute({
    where: {
      match: ctx.query.match
    },
    onSuccess: ok
  })
  ctx.body = body
  ctx.status = status
}

const create = (createBetUseCase) => async (ctx) => {
  const { body, status, location } = await createBetUseCase.execute({
    bet: ctx.request.body,
    onNotFound: notFound,
    onSuccess: created('/v1/bets')
  })
  ctx.body = body
  ctx.status = status
  if (location) {
    ctx.set('Location', location)
  }
}

const acceptBet = (acceptBetUseCase) => async (ctx) => {
  const { body, status } = await acceptBetUseCase.execute({
    betId: ctx.params.id,
    takerId: ctx.request.body.taker,
    onNotFound: notFound,
    onSuccess: ok
  })
  ctx.body = body
  ctx.status = status
}

export const createBetController = ({
  findBetsUseCase,
  createBetUseCase,
  acceptBetUseCase
}) => ({
  index: index(findBetsUseCase),
  create: create(createBetUseCase),
  acceptBet: acceptBet(acceptBetUseCase)
})
