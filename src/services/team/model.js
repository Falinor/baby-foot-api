import config from '../../config';
import { find, save, vertex } from '../../components/model';

/**
 * Find the matches that a team played.
 * @param db {Object} The database instance.
 */
export const findMatches = (db) => (teamId) => {
  const query = `
    LET team = DOCUMENT(@id)
    FOR matches IN OUTBOUND team GRAPH @graph
      RETURN matches
  `;
  const bindVars = {
    id: `${config.db.collections.teams}/${teamId}`,
    graph: config.db.graphName
  };
  return db.query(query, bindVars)
    .then(cursor => cursor.all());
};

/**
 * Find the players belonging to a team.
 * @param db {Object} The database instance.
 */
export const findPlayers = (db) => (teamId) => {
  const query = `
    LET team = DOCUMENT(@id)
    FOR players IN INBOUND team GRAPH @graph
      RETURN players
  `;
  const bindVars = {
    id: `${config.db.collections.teams}/${teamId}`,
    graph: config.db.graphName
  };
  return db.query(query, bindVars)
    .then(cursor => cursor.all());
};

export { find, save, vertex } from '../../components/model';

export default (db) => {
  const teamStore = db.graph(config.db.graphName)
    .vertexCollection(config.db.collections.teams);
  return {
    find: find(teamStore),
    findMatches: findMatches(db),
    findPlayers: findPlayers(db),
    save: save(teamStore),
    vertex: vertex(teamStore)
  };
};
