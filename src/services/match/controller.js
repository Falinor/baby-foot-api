import { notFound, success } from '../../components/response';

/**
 *
 * @param model {object}
 */
export const create = (model) => async (req, res, next) =>
  model.save(req.body)
    .then(data => Object.assign(data, req.body))
    .then(success(res, 201))
    .catch(next);

/**
 *
 * @param model
 */
export const find = (model) => async (req, res, next) =>
  model.find(req.body, req.query)
    .then(success(res))
    .catch(next);

/**
 *
 * @param model
 */
export const get = (model) => async (req, res, next) =>
  model.vertex(req.params.id)
    .then(success(res))
    .catch(next);

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

export default (model) => ({
  create: create(model),
  find: find(model),
  get: get(model),
  teams: teams(model),
  winners: winners(model),
  losers: losers(model)
});
