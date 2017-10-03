import { find, get } from '../../components/controller';
import { success } from '../../components/response';

export const getMatches = (model) => async (req, res, next) =>
  model.getMatches(req.params.id)
    .then(success(res))
    .catch(next);

export { find, get } from '../../components/controller';

export default (model) => ({
  find: find(model),
  get: get(model),
  getMatches: getMatches(model)
});
