import Router from 'koa-router';

export default playerController =>
  new Router()
    .prefix('/players')
    .get('/', playerController.index)
    .get('/:id', playerController.show);
