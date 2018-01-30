import { asFunction, asValue, createContainer } from 'awilix';
import bunyan from 'bunyan';

import { createGetPlayerUseCase } from './app/player';
import createPlayerRepository from './infra/player/repository';
import createPlayerCtrl from './interfaces/http/player/controller';
import createApp from './interfaces/http/app';

export default config => createContainer()
  .register('config', asValue(config))
  // Logger
  .register('logger', asValue(bunyan.createLogger({
    name: config.appName,
    level: config.log.level,
  })))
  // Register application
  .register('app', asFunction(createApp).singleton())
  // Register use cases
  .register('getPlayerUseCase', asFunction(createGetPlayerUseCase))
  // Repositories
  .register('playerRepository', asFunction(createPlayerRepository).singleton())
  // Controllers
  .register('playerController', asFunction(createPlayerCtrl));
