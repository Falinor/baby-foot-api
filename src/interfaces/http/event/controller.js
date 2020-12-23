import { created, notFound, ok } from '../../../utils'

const index = (findEventsUseCase) => async (ctx) => {
  const { body, status } = await findEventsUseCase.execute({
    onSuccess: ok
  })
  ctx.body = body
  ctx.status = status
}

const create = (createEventUseCase) => async (ctx) => {
  const { body, status, location } = await createEventUseCase.execute({
    event: ctx.request.body,
    onNotFound: notFound,
    onSuccess: created(`/v1/events`)
  })
  ctx.body = body
  ctx.status = status
  if (location) {
    ctx.set('Location', location)
  }
}

export const createEventController = ({
  findEventsUseCase,
  createEventUseCase
}) => ({
  index: index(findEventsUseCase),
  create: create(createEventUseCase)
})
