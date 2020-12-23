import {
  created,
  noContent,
  notFound,
  ok,
  unprocessableEntity
} from '../../../utils'

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

const update = (updateMatchUseCase) => async (ctx) => {
  const { body, status, location } = await updateMatchUseCase.execute({
    id: ctx.params.id,
    payload: ctx.request.body,
    onMaxPointsError: unprocessableEntity,
    onPlayersError: unprocessableEntity,
    onPlayersNotFound: notFound,
    onCreate: created('/v1/matches'),
    onUpdate: ok
  })
  ctx.body = body
  ctx.status = status
  if (location) {
    ctx.set('Location', location)
  }
}

const remove = (removeMatchUseCase) => async (ctx) => {
  const { status } = await removeMatchUseCase.execute({
    id: ctx.params.id,
    onSuccess: noContent
  })
  ctx.status = status
}

export const createMatchController = ({
  findMatchesUseCase,
  createMatchUseCase,
  updateMatchUseCase,
  removeMatchUseCase
}) => ({
  index: index(findMatchesUseCase),
  create: create(createMatchUseCase),
  update: update(updateMatchUseCase),
  remove: remove(removeMatchUseCase)
})
