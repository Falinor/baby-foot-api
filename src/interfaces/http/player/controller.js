import HttpStatus from 'http-status'

const index = (playerRepository) => async (ctx) => {
  ctx.body = await playerRepository.find({
    where: ctx.query
  })
  ctx.status = HttpStatus.OK
}

const show = (playerRepository) => async (ctx) => {
  ctx.body = await playerRepository.get(ctx.params.id)
  ctx.status = HttpStatus.OK
}

export const createPlayerController = ({ playerRepository }) => ({
  index: index(playerRepository),
  show: show(playerRepository)
})
