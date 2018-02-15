import Koa from 'koa';

export default (logger, routes = null) => {
  const app = new Koa();

  // Use error handler
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err);
    }
  });
  // Set content type to JSON
  app.use(async (ctx, next) => {
    ctx.type = 'application/json';
    await next();
  });
  // Register routes
  if (routes) app.use(routes);

  return app;
};
