import config from '../../config';
import { find, vertex } from '../../components/model';

export const getPlayers = (db) => async (teamHandle) =>
  console.log('getPlayers');

export { find, vertex } from '../../components/model';

export default (db) => {
  const teamStore = db.graph(config.db.graphName).vertexCollection('teams');
  return {
    find: find(teamStore),
    getPlayers: getPlayers(db),
    vertex: vertex(teamStore)
  }
};
