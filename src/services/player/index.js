import { Router } from 'express';

import controller from './controller';

export default (graph) => {
  const router = new Router();
  const ctrl = controller(graph);

  /**
   *
   */
  router.get('/players',
    ctrl.find
  );

  /**
   *
   */
  router.get('/players/:trigram',
    ctrl.get
  );

  /**
   *
   */
  router.get('/players/:trigram/teams',
    ctrl.teams
  );

  router.get('/players/:trigram/wins/count',
    ctrl.winCount
  );

  return router;
};
