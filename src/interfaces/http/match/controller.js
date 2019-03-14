import Http from 'http-status';

const index = findMatchesUseCase => async ctx => {
  const { SUCCESS, ERROR } = findMatchesUseCase.outputs;
  // Register handlers
  findMatchesUseCase
    .on(SUCCESS, matches => {
      ctx.status = Http.OK;
      ctx.body = matches;
    })
    .on(ERROR, err => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message);
    });
  return findMatchesUseCase.execute();
};

const create = createMatchUseCase => async ctx => {
  const { config } = ctx.state.container.cradle;
  const { SUCCESS, ERROR } = createMatchUseCase.outputs;
  createMatchUseCase
    .on(SUCCESS, id => {
      ctx.status = Http.CREATED;
      const { host, port, prefix } = config.url;
      ctx.set('Location', `${host}:${port}/${prefix}/matches/${id}`);
    })
    .on(ERROR, err => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message);
    });
  return createMatchUseCase.execute();
};

const createMatchController = ({ findMatchesUseCase, createMatchUseCase }) => ({
  index: index(findMatchesUseCase),
  create: create(createMatchUseCase),
});

export default createMatchController;
