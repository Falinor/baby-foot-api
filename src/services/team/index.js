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

  return router;
};
