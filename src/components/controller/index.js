import { success } from '../response';

export const create = model => async (req, res, next) =>
  model.save(req.body)
    .then(data => Object.assign(data, req.body))
    .then(success(res, 201))
    .catch(next);

export const find = model => async (req, res, next) =>
  model.find(req.query)
    .then(success(res))
    .catch(next);

export const findOne = model => async (req, res, next) =>
  model.findOne(req.query)
    .then(success(res))
    .catch(next);

export const get = model => async (req, res, next) =>
  model.vertex(req.params.id)
    .then(success(res))
    .catch(next);

export default model => ({
  create: create(model),
  find: find(model),
  findOne: findOne(model),
  get: get(model),
});
