import { Router } from 'express';

import { index, losses, show, wins } from './controller';

const router = new Router();

router.get('/',
  index
);

router.get('/:id',
  show
);

router.get('/:id/wins',
  wins
);

router.get('/:id/losses',
  losses
);

export { TEAM_COLLECTION, createTeamCollection } from './model';
export default router;
