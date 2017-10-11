import config from '../../config';
import { find, save, vertex } from '../../components/model';

export const getPlayers = (db) => async (teamHandle) =>
  console.log('getPlayers');

export { find, save, vertex } from '../../components/model';

export default (db) => {
  const teamStore = db.graph(config.db.graphName)
    .vertexCollection(config.db.collections.teams);
  return {
    find: find(teamStore),
    getPlayers: getPlayers(db),
    save: save(teamStore),
    vertex: vertex(teamStore)
  };
};
