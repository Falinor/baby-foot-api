import { create, find, get } from '../../components/controller';
import { success } from '../../components/response';

/**
 *
 * @param model
 */
export const winners = (model) => async ({ params }, res, next) => {
  res.status(501).json('Not implemented');
};

/**
 *
 * @param model
 */
export const losers = (model) => async ({ params }, res, next) => {
  res.status(501).json('Not implemented');
};

export { create, find, findOne, get } from '../../components/controller';

export default (model) => ({
  create: create(model),
  find: find(model),
  get: get(model),
  winners: winners(model),
  losers: losers(model)
});
