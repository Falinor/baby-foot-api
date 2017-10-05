import { Router } from 'express'

import createController from './controller';
import createModel from './model';

// Add the match schema to AJV for further validation

export default (db) => {
  const router = new Router();
  const model = createModel(db);
  const controller = createController(model);

  router.get('/matches',
    controller.find
  );

  router.get('/matches/:id',
    controller.get
  );

  router.get('/matches/:id/teams',
    // ...
  );

  return router;
};
