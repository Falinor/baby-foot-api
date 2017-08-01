import { Router } from 'express';

import match from './match';

export default (graph) => {
  const router = new Router();
  const matchStore = graph.vertexCollection('matches');
  const playedStore = graph.edgeCollection('played');
  const teamStore = graph.vertexCollection('teams');

  router.use(match(matchStore, playedStore, teamStore));
  // router.use('/getTeams', team(arango));
  // router.use(player(arango));

  return router;
};
