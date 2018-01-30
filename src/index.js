import createConfig from './config';
import createContainer from './container';

const config = createConfig();
const container = createContainer(config);
const logger = container.resolve('logger');
const app = container.resolve('app');

app.listen(config.port, () => {
  logger.info(`API listening on port ${config.port}.`);
});
