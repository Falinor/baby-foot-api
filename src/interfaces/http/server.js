import Koa from 'koa';
import Router from 'koa-router';

function registerMiddlewares(middlewares, app) {
  middlewares.forEach(m => {
    app.use(m);
  });
}

function registerNestedRouters(routers, mainRouter) {
  routers.forEach(r => {
    mainRouter.use(r.routes(), r.allowedMethods());
  });
}

export function createServer({
  versionPrefix = '/v1',
  middlewares = [],
  routers = [],
}) {
  const app = new Koa();
  const mainRouter = new Router({
    sensitive: false,
    prefix: versionPrefix || '/v1',
  });
  registerMiddlewares(middlewares, app);
  registerNestedRouters(routers, mainRouter);
  return app;
}
