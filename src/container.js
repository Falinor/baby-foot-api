import { asFunction, asValue, createContainer, Lifetime } from 'awilix';
import bunyan from 'bunyan';

import createApp from './interfaces/http/app';

/**
 * Create a DI container.
 * @param config
 * @return {AwilixContainer}
 */
export default config => createContainer()
  .register('config', asValue(config))
  // Logger
  .register('logger', asValue(bunyan.createLogger({
    name: config.appName,
    level: config.log.level,
  })))
  // Register application
  .register('app', asFunction(createApp).singleton())
  .loadModules([
    // Register use cases
    'app/**/*.js',
    // Register repositories
    'infra/**/*.js',
  ], {
    cwd: __dirname,
    formatName: 'camelCase',
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

