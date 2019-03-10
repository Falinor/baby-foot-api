import Router from 'koa-router';

export const createMatchRouter = matchController =>
  new Router()
    .prefix('/matches')
    .get('/', matchController.index)
    .post('/', matchController.create);
