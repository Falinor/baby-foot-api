import { createLogger as createBunyanLogger } from 'bunyan'

import { config } from './config'

export const LogLevel = {
  Fatal: 'fatal',
  Error: 'error',
  Warn: 'warn',
  Info: 'info',
  Debug: 'debug',
  Trace: 'trace'
}

export function createLogger({ level = LogLevel.Debug }) {
  return createBunyanLogger({
    level,
    name: 'Baby-foot API'
  })
}

export const logger = createLogger({ level: config.log.level })
