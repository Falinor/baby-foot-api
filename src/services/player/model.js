import { find, findOne } from '../../components/model';
import config from '../../config';

/**
 * Find teams a player has been member of.
 * @param db {Object} The database instance.
 */
export const findTeams = (db) => async (trigram) => {
  const query = `
    LET player = DOCUMENT(@id)
    FOR teams IN OUTBOUND player GRAPH @graph
    RETURN teams
  `;
  const bindVars = {
    id: `${config.db.collections.players}/${trigram}`,
    graph: config.db.graphName
  };
  return db.query(query, bindVars)
    .then(cursor => cursor.all());
};

export { find, findOne } from '../../components/model';

export default (db) => {
  const playerStore = db.graph(config.db.graphName)
    .vertexCollection(config.db.collections.players);
  return {
    find: find(playerStore),
    findOne: findOne(playerStore),
    findTeams: findTeams(db)
  };
};
