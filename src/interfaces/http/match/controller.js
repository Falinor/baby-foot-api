import Http from 'http-status';

const index = async (ctx) => {
  const { findMatches } = ctx.state.container.cradle;
  const { SUCCESS, ERROR } = findMatches.outputs;
  // Register handlers
  findMatches
    .on(SUCCESS, (matches) => {
      ctx.status = Http.OK;
      ctx.body = matches;
    })
    .on(ERROR, (err) => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message);
    });
  return findMatches.execute();
};

export default {
  index,
};
