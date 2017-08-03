import { Router } from 'express';

import createController from './controller';
import createModel from './model';

export default (teamStore) => {
  const router = new Router();
  const model = createModel(teamStore);
  const controller = createController(model);

  router.get('/teams',
    controller.find
  );

  router.get('/teams/:id',
    controller.get
  );

  router.get('/teams/:id/matches',
    // ...
  );

  router.get('/teams/:id/players',
    // ...
  );

  router.post('/teams/:id/players',
    // ...
  );

  return router;
};
