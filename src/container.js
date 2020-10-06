import {
  asClass,
  asFunction,
  createContainer as createAwilixContainer
} from 'awilix'

import CreateMatchUseCase from './app/match/create-match'
import { FindMatchesUseCase } from './app/match/find-matches'
import { createDatabase } from './core/arangodb'
import {
  createMatchArangoRepository,
  createMatchMemoryRepository
} from './infra/match'
import { createPlayerMemoryRepository } from './infra/player'
import { createPlayerArangoRepository } from './infra/player/arango-repository'
import { createTeamArangoRepository } from './infra/team/arango-repository'
import { createTeamMemoryRepository } from './infra/team/memory-repository'
import {
  createMatchController,
  createMatchRouter
} from './interfaces/http/match'

export function createContainer() {
  const container = createAwilixContainer().register({
    // Database
    db: asFunction(createDatabase, { lifetime: 'SINGLETON' }),

    // Match
    matchRepository: asFunction(createMatchArangoRepository),
    createMatchUseCase: asClass(CreateMatchUseCase),
    findMatchesUseCase: asClass(FindMatchesUseCase),
    matchController: asFunction(createMatchController),
    matchRouter: asFunction(createMatchRouter),

    // Team
    teamRepository: asFunction(createTeamArangoRepository),

    // Player
    playerRepository: asFunction(createPlayerArangoRepository)
  })

  return {
    register: container.register,
    resolve: container.resolve,
    loadModules: container.loadModules
  }
}

export default createContainer()
