import { createController } from 'awilix-koa';

export default controller => createController(controller)
  .prefix('/players')
  .get('/:id', 'show'); // Maps GET /players to controller.show
