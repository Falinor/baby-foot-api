import { Router } from 'express'

import createController from './controller';
import createModel from './model';

// Add the match schema to AJV for further validation

export default (matchStore, playedStore, teamStore) => {
  const router = new Router();
  const model = createModel(matchStore, playedStore, teamStore);
  const controller = createController(model);

  router.get('/matches',
    controller.find
  );

  router.post('/matches',
    controller.create
  );

  router.get('/matches/:id',
    controller.get
  );

  router.get('/matches/:id/teams',
    controller.getTeams
  );

  router.post('/matches/:id/teams',
    controller.createTeams
  );

  return router;
};
