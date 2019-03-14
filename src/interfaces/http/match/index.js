import Router from 'koa-router';

import matchSchemas from './schemas';

const createMatchRouter = ({ validateInput, matchController }) =>
  new Router()
    .prefix('/matches')
    .get('/', matchController.index)
    .post('/', validateInput(matchSchemas.create), matchController.create);

export default createMatchRouter;
