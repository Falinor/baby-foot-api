import {
  asFunction,
  asValue,
  createContainer as createAwilixContainer,
  InjectionMode,
} from 'awilix';

import { createConfig } from './config';
import { createLogger } from './logger';

export function createContainer(config) {
  return createAwilixContainer({
    injectionMode: InjectionMode.CLASSIC,
  }).register({
    config: config == null ? asValue(config) : asFunction(createConfig),
    logger: asFunction(createLogger, {
      injector: container => ({
        logLevel: container.resolve('config').get('log.level'),
      }),
    }),
  });
}
