import { create, find, get } from '../../components/controller';
import { success } from '../../components/response';

export const findMatches = (model) => async (req, res, next) =>
  model.findMatches(req.params.id)
    .then(success(res))
    .catch(next);

export const findPlayers = (model) => async (req, res, next) =>
  model.findPlayers(req.params.id)
    .then(success(res))
    .catch(next);

export { create, find, get } from '../../components/controller';

export default (model) => ({
  create: create(model),
  find: find(model),
  findMatches: findMatches(model),
  findPlayers: findPlayers(model),
  get: get(model)
});
