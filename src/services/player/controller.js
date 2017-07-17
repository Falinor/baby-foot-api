import { find, get } from '../../components/controller';

export { find, get } from '../../components/controller';

export default (model) => ({
  find: find(model),
  get: get(model)
});
