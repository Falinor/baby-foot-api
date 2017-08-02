import { find } from '../../components/controller';
import { success } from '../../components/response';

export const findOneByTrigram = (model) => async (req, res, next) =>
  model.findOne({ trigram: req.params.trigram.toUpperCase() })
    .then(success(res))
    .catch(next);

export { find } from '../../components/controller';

export default (model) => ({
  find: find(model),
  findOneByTrigram: findOneByTrigram(model)
});
