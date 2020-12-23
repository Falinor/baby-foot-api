import {
  asClass,
  asFunction,
  asValue,
  createContainer as createAwilixContainer
} from 'awilix'
import axios from 'axios'

import {
  AcceptBetUseCase,
  CreateBetUseCase,
  CreateEventUseCase,
  CreateMatchUseCase,
  FindBetsUseCase,
  FindMatchesUseCase,
  FindEventsUseCase
} from './app'
import { RemoveMatchUseCase } from './app/match/remove-match'
import { UpdateMatchUseCase } from './app/match/update-match'
import { config, createDatabase } from './core'
import {
  createBetArangoRepository,
  createBettorArangoRepository,
  createEventArangoRepository,
  createMatchArangoRepository,
  createPlayerArangoRepository,
  createRankingService,
  createTeamArangoRepository
} from './infra'
import { createBabybetAttractionHttpRepository } from './infra/attraction-babybet'
import { createBabyfootAttractionHttpRepository } from './infra/attraction-babyfoot'
import { createBetController, createBetRouter } from './interfaces/http/bet'
import {
  createEventController,
  createEventRouter
} from './interfaces/http/event'
import {
  createMatchController,
  createMatchRouter
} from './interfaces/http/match'
import {
  createPlayerController,
  createPlayerRouter
} from './interfaces/http/player'
import { createTeamController, createTeamRouter } from './interfaces/http/team'

export function createContainer() {
  const container = createAwilixContainer().register({
    // Config
    enableRanking: asValue(config.feature.ranking),
    maxPoints: asValue(config.maxPoints),

    // Database
    db: asFunction(createDatabase, { lifetime: 'SINGLETON' }),

    http: asValue(axios.create()),

    // Attractions
    babybetAttractionRepository: asFunction(
      createBabybetAttractionHttpRepository
    ),
    babyfootAttractionRepository: asFunction(
      createBabyfootAttractionHttpRepository
    ),

    // Bet
    bettorRepository: asFunction(createBettorArangoRepository),
    betRepository: asFunction(createBetArangoRepository),
    findBetsUseCase: asClass(FindBetsUseCase),
    createBetUseCase: asClass(CreateBetUseCase),
    acceptBetUseCase: asClass(AcceptBetUseCase),
    betController: asFunction(createBetController),
    betRouter: asFunction(createBetRouter),

    // Event
    eventRepository: asFunction(createEventArangoRepository),
    createEventUseCase: asClass(CreateEventUseCase),
    findEventsUseCase: asClass(FindEventsUseCase),
    eventController: asFunction(createEventController),
    eventRouter: asFunction(createEventRouter),

    // Match
    matchRepository: asFunction(createMatchArangoRepository),
    createMatchUseCase: asClass(CreateMatchUseCase),
    findMatchesUseCase: asClass(FindMatchesUseCase),
    updateMatchUseCase: asClass(UpdateMatchUseCase),
    removeMatchUseCase: asClass(RemoveMatchUseCase),
    matchController: asFunction(createMatchController),
    matchRouter: asFunction(createMatchRouter),

    // Team
    teamRepository: asFunction(createTeamArangoRepository),
    teamController: asFunction(createTeamController),
    teamRouter: asFunction(createTeamRouter),

    // Player
    playerRepository: asFunction(createPlayerArangoRepository),
    playerController: asFunction(createPlayerController),
    playerRouter: asFunction(createPlayerRouter),

    // Ranking
    rankingService: asFunction(createRankingService)
  })

  return {
    register: container.register,
    resolve: container.resolve,
    loadModules: container.loadModules
  }
}

export default createContainer()
