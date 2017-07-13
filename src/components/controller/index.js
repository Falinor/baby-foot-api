import { success } from '../response';

export const find = (model) => async (req, res, next) =>
  model.find(req.query)
    .then(cursor => cursor.all())
    .then(success(res))
    .catch(next);

export const findOne = (model) => async (req, res, next) =>
  model.findOne(req.query)
    .then(success(res))
    .catch(next);

export const vertex = (model) => async (req, res, next) =>
  model.vertex(req.params.id)
    .then(success(res))
    .catch(next);

export const save = (model) => async (req, res, next) =>
  model.save(req.body)
    .then(success(res))
    .catch(next);

export default (model) => ({
  find: find(model),
  findOne: findOne(model),
  vertex: vertex(model),
  save: save(model)
});
