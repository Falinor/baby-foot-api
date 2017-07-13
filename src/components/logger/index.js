import winston from 'winston';

import config from '../../config';

winston.level = config.logLevel;
export default winston;
