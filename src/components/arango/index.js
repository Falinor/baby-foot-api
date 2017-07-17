import { Database } from 'arangojs';

import logger from '../../components/logger';
import config from '../../config';

/**
 * Initializes database, graph and collections.
 * @param db {object} The database connection object.
 */
const init = (db) => async (options = config.db) => {
  try {
    await db.createDatabase(options.databaseName);
    db.useDatabase(options.databaseName);
    const graph = db.graph(options.graphName);
    await graph.create({});
    return graph;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

/**
 *
 * @param options
 * @return {Promise<"arangojs".Database>}
 */
export default async (options = config.db) => {
  const db = new Database(options);
  db.useDatabase('_system');
  db.init = init(db);
  return db;
};
