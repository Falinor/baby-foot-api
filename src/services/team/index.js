import { Router } from 'express';

import createController from './controller';
import createModel from './model';

export default (db) => {
  const router = new Router();
  const model = createModel(db);
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

  return router;
};
