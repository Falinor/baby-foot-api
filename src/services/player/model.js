import { find, findOne } from '../../components/model';

export { find, findOne } from '../../components/model';

export default (store) => ({
  find: find(store),
  findOne: findOne(store)
});
