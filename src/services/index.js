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

  router.use(match(matchStore, playedStore, teamStore));
  router.use(team(teamStore));
  router.use(player(playerStore));

  return router;
};
