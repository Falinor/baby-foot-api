import createConfig from './config';
import createContainer from './container';
import playerRoutes from './interfaces/http/player';

const config = createConfig();
const container = createContainer(config);
// Resolve app and logger into the DI container
const { app, logger } = container.cradle;

// Scope-per-request middleware
app.use((ctx, next) => {
  ctx.state.container = container.createScope();
  return next();
});

// Register routes
app.use(playerRoutes.routes());
app.use(playerRoutes.allowedMethods());

app.listen(config.port, () => {
  logger.info(`API listening on port ${config.port}.`);
});
