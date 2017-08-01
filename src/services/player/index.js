import { Router } from 'express';

import createController from './controller';
import createModel from './model';

export default (store) => {
  const router = new Router();
  const model = createModel(store);
  const controller = createController(model);

  /**
   *
   */
  router.get('/players',
    controller.find
  );

  /**
   *
   */
  router.get('/players/:trigram',
    controller.get
  );

  /**
   *
   */
  router.get('/players/:trigram/getTeams',
    controller.teams
  );

  router.get('/players/:trigram/wins',
    // ...
  );

  router.get('/players/:trigram/wins/count',
    // ...
  );

  router.get('/players/:trigram/losses',
    // ...
  );

  router.get('/players/:trigram/losses/count',
    // ...
  );

  return router;
};
