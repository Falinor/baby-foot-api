import { find, findOne, save, vertex } from '../../components/model';
import config from '../../config';



export { find, findOne, save, vertex };

export default (db) => {
  const matchStore = db.graph(config.db.graphName)
    .vertexCollection(config.db.collections.matches);
  return {
    find: find(matchStore),
    findOne: findOne(matchStore),
    save: save(matchStore),
    vertex: vertex(matchStore)
  };
};
