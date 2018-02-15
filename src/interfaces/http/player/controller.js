import Http from 'http-status';

export const show = getPlayerUseCase =>
  async (ctx) => {
    const { SUCCESS, ERROR } = getPlayerUseCase.outputs;
    // Register handlers
    getPlayerUseCase
      .on(SUCCESS, (player) => {
        ctx.status = Http.OK;
        ctx.body = player;
      })
      .on(ERROR, (err) => {
        ctx.throw(400, err.message);
      });
    // Execute the use case
    return getPlayerUseCase.execute(ctx.params.id);
  };

export default ({ getPlayer }) => ({
  show: show(getPlayer),
});
