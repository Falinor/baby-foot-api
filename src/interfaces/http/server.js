import cors from '@koa/cors'
import Koa from 'koa'

import container from '../../container'
import { config, logger } from '../../core'
import { errorHandler } from './middlewares'

export function createServer() {
  const app = new Koa()

  app.use(errorHandler({ logger }))
  app.use(cors())
  app.use(container.resolve('matchRouter'))
  app.use(container.resolve('teamRouter'))
  app.use(container.resolve('playerRouter'))

  return {
    httpServer: app.callback(),
    start() {
      app.listen(config.port, () => {
        logger.info(`API listening on port ${config.port}.`)
      })
    }
  }
}
