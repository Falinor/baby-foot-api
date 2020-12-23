import HttpStatus from 'http-status'

const index = (playerRepository) => async (ctx) => {
  ctx.body = await playerRepository.find({
    where: ctx.query
  })
  ctx.status = HttpStatus.OK
}

const show = (playerRepository) => async (ctx) => {
  const player = await playerRepository.get(ctx.params.id)
  if (!player) {
    ctx.status = HttpStatus.NOT_FOUND
    return
  }

  ctx.body = player
  ctx.status = HttpStatus.OK
}

export const createPlayerController = ({ playerRepository }) => ({
  index: index(playerRepository),
  show: show(playerRepository)
})
