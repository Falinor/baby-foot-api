import Koa from 'koa';

export default (errorHandler, routes = null) => {
  const app = new Koa();

  // Register common middlewares
  app.use(errorHandler);
  // Register routes
  if (routes) app.use(routes);

  return app;
};
