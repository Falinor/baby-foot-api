import { createLogger as createBunyanLogger } from 'bunyan'

export const LogLevel = {
  Fatal: 'fatal',
  Error: 'error',
  Warn: 'warn',
  Info: 'info',
  Debug: 'debug',
  Trace: 'trace'
}

export function createLogger(level = LogLevel.Warn) {
  const bunyan = createBunyanLogger({
    level,
    name: 'Baby-foot API'
  })
  return {
    [LogLevel.Fatal]: bunyan.fatal,
    [LogLevel.Error]: bunyan.error,
    [LogLevel.Warn]: bunyan.warn,
    [LogLevel.Info]: bunyan.info,
    [LogLevel.Debug]: bunyan.debug,
    [LogLevel.Trace]: bunyan.trace
  }
}
