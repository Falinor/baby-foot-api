import { loadControllers, scopePerRequest } from 'awilix-koa';

import createConfig from './config';
import createContainer from './container';

const config = createConfig();
const container = createContainer(config);
// Resolve app and logger into the DI container
const { app, logger } = container.cradle;

app.use(scopePerRequest(container));

app.use(loadControllers('http/**/index.js'));

app.listen(config.port, () => {
  logger.info(`API listening on port ${config.port}.`);
});
