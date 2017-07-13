import { Router } from 'express'

import createController from './controller';
import createModel from './model';

// Add the match schema to AJV for further validation

export default (store) => {
  const router = new Router();
  const model = createModel(store);
  const controller = createController(model);

  router.post('/matches',
    controller.create
  );

  router.get('/matches',
    controller.find
  );

  router.get('/matches/:id',
    controller.get
  );

  router.get('/matches/:id/teams',
    controller.teams
  );

  router.get('/matches/:id/winners',
    controller.winners
  );

  router.get('/matches/:id/losers',
    controller.losers
  );

  return router;
};
