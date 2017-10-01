import { Router } from 'express';

import match from './match';
import player from './player';
import team from './team';

export default (graph) => {
  const router = new Router();
  // Create vertex collections
  const matchStore = graph.vertexCollection('matches');
  const teamStore = graph.vertexCollection('teams');
  const playerStore = graph.vertexCollection('players');
  // Create edge collections
  const playedStore = graph.edgeCollection('played');
  const memberStore = graph.edgeCollection('member');

  // Use match router
  router.use(match({
    matchStore,
    playedStore,
    teamStore
  }));
  // Use team router
  router.use(team({
    matchStore,
    teamStore,
    playerStore,
    playedStore,
    memberStore
  }));
  // Use player router
  router.use(player({
    playerStore
  }));

  return router;
};
