import { createController } from 'awilix-koa';

import controller from './controller';

export default createController(controller)
  .prefix('/players')
  .get('/:id', 'show'); // Maps GET /players to controller.show
