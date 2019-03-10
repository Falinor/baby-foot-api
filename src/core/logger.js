import { createLogger as createBunyanLogger } from 'bunyan';

export const LogLevel = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace',
};

export function createLogger(level = LogLevel.WARN) {
  const bunyan = createBunyanLogger({
    level,
    name: 'Baby-foot API',
  });
  return {
    [LogLevel.FATAL]: bunyan.fatal,
    [LogLevel.ERROR]: bunyan.error,
    [LogLevel.WARN]: bunyan.warn,
    [LogLevel.INFO]: bunyan.info,
    [LogLevel.DEBUG]: bunyan.debug,
    [LogLevel.TRACE]: bunyan.trace,
  };
}
