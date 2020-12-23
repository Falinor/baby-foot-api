import cors from '@koa/cors'
import Koa from 'koa'
import morgan from 'koa-morgan'

import container from '../../container'
import { config, logger } from '../../core'
import { errorHandler } from './middlewares'

export function createServer() {
  const app = new Koa()

  app.use(errorHandler({ logger }))
  app.use(cors())
  app.use(morgan('dev'))
  app.use(container.resolve('matchRouter'))
  app.use(container.resolve('teamRouter'))
  app.use(container.resolve('playerRouter'))
  app.use(container.resolve('betRouter'))
  app.use(container.resolve('eventRouter'))

  return {
    httpServer: app.callback(),
    start() {
      app.listen(config.port, () => {
        logger.info(`API listening on port ${config.port}.`)
      })
    }
  }
}
