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

const create = ({ baseURL, createMatchUseCase }) => async ctx => {
  const { SUCCESS, ERROR } = createMatchUseCase.outputs;
  createMatchUseCase
    .on(SUCCESS, match => {
      ctx.status = Http.CREATED;
      ctx.set('Location', `${baseURL}/matches/${match.id}`);
    })
    .on(ERROR, err => {
      ctx.throw(Http.INTERNAL_SERVER_ERROR, err.message);
    });
  // TODO: validate request body
  return createMatchUseCase.execute(ctx.request.body);
};

const createMatchController = ({ baseURL, findMatches, createMatch }) => ({
  index: index(findMatches),
  create: create({ baseURL, createMatchUseCase: createMatch }),
});

export default createMatchController;
