import {
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
  Lifetime,
} from 'awilix';
import bunyan from 'bunyan';

import createMatchRepository from './infra/match/repository';
import createPlayerRepository from './infra/player/repository';
import createTeamRepository from './infra/team/repository';
import createApp from './interfaces/http/app';
import createMatchController from './interfaces/http/match/controller';
import createMatchRouter from './interfaces/http/match';

/**
 * Create a DI container.
 * @param config {Object} - A configuration object
 * @return {AwilixContainer}
 */
export default config =>
  createContainer({ injectionMode: InjectionMode.CLASSIC })
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
    ], {
      cwd: __dirname,
      formatName: 'camelCase',
      resolverOptions: { lifetime: Lifetime.TRANSIENT },
    })
    // Register repositories
    .register('matchRepository', asFunction(createMatchRepository))
    .register('teamRepository', asFunction(createTeamRepository))
    .register('playerRepository', asFunction(createPlayerRepository))
    // Register controllers
    .register(
      'matchController',
      asFunction(createMatchController).proxy(),
    )
    // Routes
    .register(
      'matchRouter',
      asFunction(createMatchRouter).singleton(),
    );

