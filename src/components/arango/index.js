import { Database } from 'arangojs';

import logger from '../../components/logger';
import config from '../../config';

/**
 * Initializes database, graph and collections.
 * @param db {object} The database connection object.
 */
const init = (db) => async (options = config.db) => {
  return db.createDatabase(options.databaseName)
    .catch(() => logger.info(`Database ${options.databaseName} exists.`))
    .then(() => db.useDatabase(options.databaseName))
    .then(() => db.graph(options.graphName))
    .then(async graph => {
      await graph.create({
        edgeDefinitions: []
      });
      return graph;
    })
    .catch(() => {
      logger.info(`Graph ${options.graphName} exists.`);
      return db.graph(options.graphName);
    });
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
