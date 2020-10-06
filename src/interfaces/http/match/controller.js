import { created, notFound, ok, unprocessableEntity } from '../../../utils'

const index = (findMatchesUseCase) => async (ctx) => {
  const { body, status } = await findMatchesUseCase.execute({
    onSuccess: ok
  })
  ctx.body = body
  ctx.status = status
}

const create = (createMatchUseCase) => async (ctx) => {
  const { body, status, location } = await createMatchUseCase.execute({
    match: ctx.request.body,
    onMaxPointsError: unprocessableEntity,
    onPlayersError: unprocessableEntity,
    onPlayersNotFound: notFound,
    onSuccess: created('/v1/matches')
  })
  ctx.body = body
  ctx.status = status
  if (location) {
    ctx.set('Location', location)
  }
}

export const createMatchController = ({
  findMatchesUseCase,
  createMatchUseCase
}) => ({
  index: index(findMatchesUseCase),
  create: create(createMatchUseCase)
})
