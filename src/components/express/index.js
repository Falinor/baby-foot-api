import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

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

  app.use('/docs', swagger.serve(), swagger.setup());
  app.use('/', (req, res) => res.status(200).json('Welcome!'));

  app.use((err, req, res, next) => {
    res.status(err.code || 500).json({
      name: err.name,
      message: err.message
    });
  });

  return app;
}
