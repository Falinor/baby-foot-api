import Http from 'http-status';

export const index = findMatchesUseCase =>
  async (ctx) => {
    const { SUCCESS, ERROR } = findMatchesUseCase.outputs;
    // Register handlers
    findMatchesUseCase
      .on(SUCCESS, (matches) => {
        ctx.status = Http.OK;
        ctx.body = matches;
      })
      .on(ERROR, (err) => {
        ctx.throw(400, err.message);
      });
    return findMatchesUseCase.execute();
  };

export default ({ findMatchesUseCase }) => ({
  index: index(findMatchesUseCase),
});
