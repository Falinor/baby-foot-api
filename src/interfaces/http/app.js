import Koa from 'koa';

export default (logger, routes = null) => {
  const app = new Koa();

  // Use error handler
  app.use(async (ctx, next) => {
    try {
      next();
    } catch (err) {
      logger.error(err);
      ctx.body = err;
    }
  });
  // Set content type to JSON
  app.use(async (ctx, next) => {
    ctx.type = 'application/json';
    next();
  });
  // Register routes
  if (routes) app.use(routes);

  return app;
};
