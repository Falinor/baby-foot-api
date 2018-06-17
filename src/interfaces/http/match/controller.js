import Http from 'http-status';

const index = async ctx => {
  const { findMatches } = ctx.state.container.cradle;
  const { SUCCESS, ERROR } = findMatches.outputs;
  // Register handlers
  findMatches
    .on(SUCCESS, matches => {
      ctx.status = Http.OK;
      ctx.body = matches;
    })
    .on(ERROR, err => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message);
    });
  return findMatches.execute();
};

// show

const create = async ctx => {
  const { config, createMatch } = ctx.state.container.cradle;
  const { SUCCESS, ERROR } = createMatch.outputs;
  createMatch
    .on(SUCCESS, id => {
      ctx.status = Http.CREATED;
      const { host, port, prefix } = config.url;
      ctx.set('Location', `${host}:${port}/${prefix}/matches/${id}`);
    })
    .on(ERROR, err => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message);
    });
  return createMatch.execute();
};

export default {
  index,
  create,
};
