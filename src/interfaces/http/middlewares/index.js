export function errorHandler(logger) {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      logger.error(err)
    }
  }
}

export default {
  errorHandler
}
