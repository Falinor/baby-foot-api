export const scopePerRequest = container =>
  async (ctx, next) => {
    ctx.state.container = container.createScope();
    await next();
  };

export default {
  scopePerRequest,
};

