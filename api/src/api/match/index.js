import { middleware as body } from 'bodymen';
import { Router } from 'express'
import { middleware as query } from 'querymen';

import { create, index, show, destroy } from './controller';
import { matchSchema } from './schema';

const router = new Router();

/**
 * @api {post} /matches Create match
 * @apiName CreateMatch
 * @apiGroup Match
 * @apiParam red Match's red.
 * @apiParam blue Match's blue.
 * @apiParam  Match's .
 * @apiSuccess {Object} match Match's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Match not found.
 */
router.post('/',
  body(matchSchema),
  create);

/**
 * @api {get} /matches Retrieve matches
 * @apiName RetrieveMatches
 * @apiGroup Match
 * @apiUse listParams
 * @apiSuccess {Object[]} matches List of matches.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index);

/**
 * @api {get} /matches/:id Retrieve match
 * @apiName RetrieveMatch
 * @apiGroup Match
 * @apiSuccess {Object} match Match's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Match not found.
 */
/*
router.get('/:id',
  show);
  */

/**
 * @api {delete} /matches/:id Delete match
 * @apiName DeleteMatch
 * @apiGroup Match
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Match not found.
 */
/*
router.delete('/:id',
  destroy);
  */

// export Match, { schema } from './model';
export default router
