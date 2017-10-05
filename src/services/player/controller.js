import { find } from '../../components/controller';
import { success } from '../../components/response';

export const findOneByTrigram = (model) => async (req, res, next) =>
  model.findOne({ trigram: req.params.trigram.toLowerCase() })
    .then(success(res))
    .catch(next);

export const findTeams = (model) => async (req, res, next) =>
  model.findTeams(req.params.trigram.toLowerCase())
    .then(success(res))
    .catch(next);

export { find } from '../../components/controller';

export default (model) => ({
  find: find(model),
  findOneByTrigram: findOneByTrigram(model),
  findTeams: findTeams(model)
});
