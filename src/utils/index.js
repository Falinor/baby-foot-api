export const scopePerRequest = container => async (ctx, next) => {
  ctx.state.container = container.createScope()
  await next()
}

export const passThrough = () => async (ctx, next) => next()

export default {
  scopePerRequest
}
