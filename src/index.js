import { asValue } from 'awilix';
import mongo from 'mongodb';

import createConfig from './config';
import createContainer from './container';

const config = createConfig();
const container = createContainer(config);
// Resolve app and logger into the DI container
const { app, logger, matchRouter } = container.cradle;

// Scope-per-request middleware
// app.use((ctx, next) => {
//   ctx.state.container = container.createScope();
//   return next();
// });

mongo.connect(config.db.url)
  .then(client => client.db(config.db.name))
  .then((db) => {
    container
      .register('matchStore', asValue(db.collection('Matches')));
  })
  .then(() => {
    // Register routes
    app.use(matchRouter.routes());
    app.use(matchRouter.allowedMethods());
    // Start the API
    app.listen(config.port, () => {
      logger.info(`API listening on port ${config.port}.`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });

export default app;
