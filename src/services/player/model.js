import { find, findOne } from '../../components/model';
import config from '../../config';

const COLLECTION = 'players';

/**
 * Find teams a player has been member of.
 * @param db {Object} The database instance.
 */
export const findTeams = (db) => async (playerId) => {
  const query = `
    FOR p IN 1..1 OUTBOUND @playerId GRAPH @graph
    RETURN p
  `;
  const bindVars = {
    playerId,
    graph: config.db.graphName
  };
  return db.query(query, bindVars)
    .then(cursor => cursor.all());
};

export { find, findOne } from '../../components/model';

export default (db) => {
  const store = db.graph(config.db.graphName).vertexCollection(COLLECTION);
  return {
    find: find(store),
    findOne: findOne(store),
    findTeams: findTeams(db)
  };
};
