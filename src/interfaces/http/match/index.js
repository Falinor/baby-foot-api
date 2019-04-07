import Router from 'koa-router';

import matchSchemas from './schemas';
import { passThrough } from '../../../utils';

const createMatchRouter = ({ matchController, validateInput = passThrough }) =>
  new Router()
    .prefix('/matches')
    .get('/', matchController.index)
    .post('/', validateInput(matchSchemas.create), matchController.create);

export default createMatchRouter;
