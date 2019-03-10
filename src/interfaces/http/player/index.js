import Router from 'koa-router';

export const createPlayerRouter = playerController =>
  new Router()
    .prefix('/players')
    .get('/', playerController.index)
    .get('/:id', playerController.show);
