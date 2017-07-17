import { Router } from 'express';

import match from './match';

export default (graph) => {
  const router = new Router();
  const matchStore = graph.vertexCollection('matches');

  router.use(match(matchStore));
  // router.use('/teams', team(arango));
  // router.use(player(arango));

  return router;
};
