export function errorHandler({ logger }) {
  return async (ctx, next) => {
    try {
      await next()
      if (400 <= ctx.status && ctx.status <= 599) {
        ctx.throw(ctx.status, ctx.body)
      }
    } catch (err) {
      ctx.status = err.status ?? 500
      ctx.body = {
        name: err.name ?? 'Error',
        message: err.message ?? err.msg ?? 'Unknown error'
      }
      logger.error(err)
    }
  }
}

export default {
  errorHandler
}
