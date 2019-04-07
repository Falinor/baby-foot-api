import { asFunction, asValue, Lifetime } from 'awilix';
import { createContainer } from './core/container';

import createMatchRepository from './infra/match';
import createMatchRouter from './interfaces/http/match';
import createMatchController from './interfaces/http/match/controller';
import { errorHandler } from './interfaces/http/middlewares';
import createHttpServer from './interfaces/http/server';
import { passThrough } from './utils';

/**
 * Create a DI container.
 * @param config {Object} - A configuration object
 * @return {AwilixContainer}
 */
export default (config = {}) =>
  createContainer(config)
    // Register application
    .register('httpServer', asFunction(createHttpServer).singleton())
    .loadModules(
      [
        // Register use cases
        'app/**/*.js',
      ],
      {
        cwd: __dirname,
        formatName: 'camelCase',
        resolverOptions: {
          lifetime: Lifetime.SCOPED,
        },
      },
    )
    .register({
      matchRouter: asFunction(createMatchRouter),
      matchController: asFunction(createMatchController, {
        injector: container => {
          const conf = container.resolve('config');
          return {
            baseURL: `${conf.get('url.host')}:${conf.get('url.port')}`,
          };
        },
      }),
      validateInput: asValue(passThrough),
      matchRepository: asFunction(createMatchRepository('memory'), {
        lifetime: Lifetime.SINGLETON,
      }),
      errorHandler: asFunction(errorHandler),
    });
