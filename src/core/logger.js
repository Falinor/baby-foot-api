import loglevel from 'loglevel'

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
  const logger = loglevel.getLogger('Baby-foot API')
  logger.setLevel(level)
  return logger
}

export const logger = createLogger({ level: config.log.level })
