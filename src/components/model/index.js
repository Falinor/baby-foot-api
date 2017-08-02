import { save, vertex } from './vertex';

/**
 * Finds all the entities that match with the given example.
 * @param store {object} The collection to search in.
 * @return {function} An asynchronous function that takes an example and options
 * as parameter.
 */
export const find = (store) => async (example, opts) =>
  store.byExample(example, opts)
    .then(cursor => cursor.all());

/**
 * Finds one entity that match with the given example.
 * @param store {object} The collection to search in.
 * @return {function} An asynchronous function that takes an example as
 * parameter.
 */
export const findOne = (store) => async (example) =>
  store.firstExample(example);

export { vertex, save };

export default (store) => ({
  find: find(store),
  findOne: findOne(store),
  vertex: vertex(store),
  save: save(store)
});
