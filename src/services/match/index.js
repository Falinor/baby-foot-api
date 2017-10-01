import { Router } from 'express'

import createController from './controller';
import createModel from './model';

// Add the match schema to AJV for further validation

export default (stores) => {
  const router = new Router();
  const model = createModel(stores);
  const controller = createController(model);

  router.get('/matches',
    controller.find
  );

  router.get('/matches/:id',
    controller.get
  );

  router.get('/matches/:id/teams',
    controller.getTeams
  );

  return router;
};
