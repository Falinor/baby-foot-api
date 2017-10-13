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

  router.post('/teams',
    // controller.create
  );

  router.get('/teams/:id',
    controller.get
  );

  router.get('/teams/:id/matches',
    // controller.findMatches
  );

  router.get('/teams/:id/players',
    // ...
  );

  return router;
};
