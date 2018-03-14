import Router from 'koa-router';

export default matchController =>
  new Router()
    .prefix('/matches')
    .get('/', matchController.index)
    .post('/', matchController.create);
