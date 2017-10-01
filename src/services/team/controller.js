import { find, get } from '../../components/controller';
import { success } from '../../components/response';

export const getMatches = (model) => async (req, res, next) =>
  model.vertex(req.params.id)
    .then(team => model.getMatches(team._id))
    .then(success(res))
    .catch(next);

export { find, get } from '../../components/controller';

export default (model) => ({
  find: find(model),
  get: get(model),
  getMatches: getMatches(model)
});
