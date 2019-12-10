import Http from 'http-status'

export const index = findPlayersUseCase => async ctx => {
  const { SUCCESS, ERROR } = findPlayersUseCase.outputs
  findPlayersUseCase
    .on(SUCCESS, players => {
      ctx.status = Http.OK
      ctx.body = players
    })
    .on(ERROR, err => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message)
    })
  return findPlayersUseCase.execute()
}

export const show = getPlayerUseCase => async ctx => {
  const { SUCCESS, ERROR } = getPlayerUseCase.outputs
  // Register handlers
  getPlayerUseCase
    .on(SUCCESS, player => {
      ctx.status = Http.OK
      ctx.body = player
    })
    .on(ERROR, err => {
      ctx.throw(Http.BAD_REQUEST, err.message)
    })
  // Execute the use case
  return getPlayerUseCase.execute(ctx.params.id)
}

export default ({ findPlayers, getPlayer }) => ({
  index: index(findPlayers),
  show: show(getPlayer)
})
