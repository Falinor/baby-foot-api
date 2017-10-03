import { Router } from 'express';

import match from './match';
import player from './player';
import team from './team';

export default (db) => {
  const router = new Router();

  router.use(match(db));
  router.use(team(db));
  router.use(player(db));

  return router;
};
