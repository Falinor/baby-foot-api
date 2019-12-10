import {
  asFunction,
  asValue,
  createContainer as createAwilixContainer
} from 'awilix'

import { createConfig } from './config'
import { createLogger } from './logger'

export function createContainer(config) {
  const container = createAwilixContainer().register({
    config: config == null ? asValue(config) : asFunction(createConfig),
    logger: asFunction(createLogger, {
      injector: cont => ({
        logLevel: cont.resolve('config').get('log.level')
      })
    })
  })
  return {
    register: container.register,
    resolve: container.resolve,
    loadModules: container.loadModules
  }
}

export default createContainer
