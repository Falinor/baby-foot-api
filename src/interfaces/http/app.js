import Koa from 'koa';

export default (routes, logger) => {
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
    ctx.set('Content-Type', 'application/json');
    next();
  });
  // Register routes
  app.use(routes);

  return app;
};
