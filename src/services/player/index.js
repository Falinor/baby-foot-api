import { Router } from 'express';

import createController from './controller';
import createModel from './model';

export default (db) => {
  const router = new Router();
  const model = createModel(db);
  const controller = createController(model);

  router.get('/players',
    controller.find
  );

  router.post('/players/:trigram',
    // ...
  );

  router.get('/players/:trigram',
    controller.findOneByTrigram
  );

  router.get('/players/:trigram/teams',
    controller.findTeams
  );

  router.get('/players/:trigram/matches',
    // ...
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
