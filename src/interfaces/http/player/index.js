import Router from 'koa-router';

export default playerController =>
  new Router()
    .prefix('/players')
    .get('/:id', playerController.show);
