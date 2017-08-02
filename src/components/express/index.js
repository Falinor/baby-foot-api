import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import logger from '../logger';
import swagger from '../swagger';
import config from '../../config/index'

export default (routes) => {
  const app = express();

  /* istanbul ignore next */
  if (config.env === 'production' || config.env === 'development') {
    app.use(cors());
    app.use(compression());
    app.use(morgan('dev'));
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(routes);

  // Expose documentation
  app.use('/docs', swagger.serve(), swagger.setup());
  // Root API endpoint
  app.get('/', (req, res) => res.status(200).json('Welcome!'));
  // 404 handler
  app.all('*', (req, res, next) => {
    next({
      code: 404,
      name: 'PathNotFound',
      message: 'Path not found'
    });
  });

  app.use((err, req, res, next) => {
    res.status(err.code || 500).json({
      code: err.code,
      name: err.name,
      message: err.message
    });
  });

  return app;
}
