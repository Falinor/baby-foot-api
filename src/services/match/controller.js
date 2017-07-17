import { success } from '../../components/response';

import { create, find, get } from '../../components/controller';

/**
 *
 * @param model
 */
export const teams = (model) => async ({ params }, res, next) => {
  res.status(500).json('Not implemented');
};

/**
 *
 * @param model
 */
export const winners = (model) => async ({ params }, res, next) => {
  res.status(500).json('Not implemented');
};

/**
 *
 * @param model
 */
export const losers = (model) => async ({ params }, res, next) => {
  res.status(500).json('Not implemented');
};

export { create, find, findOne, get } from '../../components/controller';

export default (model) => ({
  create: create(model),
  find: find(model),
  get: get(model),
  teams: teams(model),
  winners: winners(model),
  losers: losers(model)
});
