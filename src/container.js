import { asFunction, createContainer, Lifetime } from 'awilix';

import createGetPlayerUseCase from './app/player/get-player';
import createPlayerRepository from './infra/player/repository';
import createPlayerCtrl from './interfaces/http/player/controller';

export default () => createContainer()
  // Use cases
  .register('getPlayerUseCase', asFunction(createGetPlayerUseCase, {
    lifetime: Lifetime.SINGLETON,
  }))
  // Repositories
  .register('playerRepository', asFunction(createPlayerRepository, {
    lifetime: Lifetime.SINGLETON,
  }))
  // Controllers
  .register('playerController', asFunction(createPlayerCtrl, {
    lifetime: Lifetime.SINGLETON,
  }));
