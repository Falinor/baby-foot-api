import { find, findOne, vertex, save } from '../../components/model';

export { find, findOne, vertex, save } from '../../components/model';

export default (store) => ({
  find: find(store),
  findOne: findOne(store),
  vertex: vertex(store),
  save: save(store)
});
