import { createController } from 'awilix-koa';

import controller from './controller';

export default createController(controller)
  .prefix('/matches')
  .get('', 'index');
