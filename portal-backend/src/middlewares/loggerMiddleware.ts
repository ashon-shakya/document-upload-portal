import morgan from 'morgan';
import config from '../config/config';

// Use 'combined' format in production for detailed logging,
// and 'dev' format in development for easier debugging
const format = config.nodeEnv === 'production' ? 'combined' : 'dev';

export const loggerMiddleware = morgan(format);
