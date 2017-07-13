import { Database } from 'arangojs';

import { matchCollection } from '../../api/match/model';
import { playerCollection } from '../../api/player/model';
import { teamCollection } from '../../api/team/model';
import config from '../../config';

// Retrieve configuration
const { database, host, port, username, password } = config.db;
// Create a fresh Database instance
const db = new Database({
  url: `http://${username}:${password}@${host}:${port}`
});

/**
 * Creates a db if it does not exist. Otherwise returns the existing one.
 * @return {Promise.<void>}
 */
const initDb = async () => {
  try {
    await db.createDatabase(database, [ { username, password } ]);
    console.log(`Database ${database} created.`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`Database '${database}' already exists. Skipping...`);
    } else {
      console.log(e);
    }
  }
};

/**
 * Creates a graph if it does not exist. Otherwise returns the existing one.
 * @return {Promise.<void>}
 */
const initGraph = async () => {
  try {
    await graph.create({});
    console.log(`Graph '${config.db.graphName}' created.`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`Graph '${config.db.graphName}' already exists. Skipping...`);
    } else {
      console.error(e);
    }
  }
};

/**
 * Creates models.
 * @return {Promise.<void>}
 */
const initCollections = async () =>
  Promise.all([
    matchCollection(),
    playerCollection(),
    teamCollection()
  ]);

/**
 * Initializes a database and a graph.
 * @return {Promise.<void>}
 */
const init = async () => {
  await initDb();
  // TODO: check if that is mandatory
  db.useDatabase(database);
  await initGraph();
  await initCollections();
}

const graph = db.graph(config.db.graphName);

export { db, init };
export default graph;
