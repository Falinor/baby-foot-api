import { Router } from 'express';

import createController from './controller';
import createModel from './model';

export default (stores) => {
  const router = new Router();
  const model = createModel(stores);
  const controller = createController(model);

  router.get('/teams',
    controller.find
  );

  router.get('/teams/:id',
    controller.get
  );

  router.get('/teams/:id/matches',
    controller.getMatches
  );

  router.get('/teams/:id/players',
    // ...
  );

  return router;
};
