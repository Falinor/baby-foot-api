import { find } from '../../components/controller';
import { success } from '../../components/response';

/**
 * Find a player using its trigram.
 * The trigram is used as document key and thus, is forwarded in document's id.
 * @param model
 */
export const findOne = (model) => async (req, res, next) =>
  model.findOne({ _key: req.params.trigram.toLowerCase() })
    .then(success(res))
    .catch(next);

export const findTeams = (model) => async (req, res, next) =>
  model.findTeams(req.params.trigram.toLowerCase())
    .then(success(res))
    .catch(next);

export { find } from '../../components/controller';

export default (model) => ({
  find: find(model),
  findOne: findOne(model),
  findTeams: findTeams(model)
});
