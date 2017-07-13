import { Router } from 'express';

import match from './match';
import player from './player';
import team from './team';

export default (arango) => {
  const router = new Router();
  Object.assign(arango, {
    matchStore: arango.graph.vertexCollection('matches'),
    teamStore: arango.graph.vertexCollection('teams'),
    playerStore: arango.graph.vertexCollection('players'),
    playedStore: arango.graph.edgeCollection('played'),
    memberStore: arango.graph.edgeCollection('memberOf')
  });

  router.use(match(arango));
  // router.use('/teams', team(arango));
  // router.use(player(arango));

  return router;
};
