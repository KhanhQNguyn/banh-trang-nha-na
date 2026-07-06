import morgan from 'morgan';
import { env } from '../config/env.js';

export const requestLogger = env.nodeEnv === 'development' 
  ? morgan('dev') 
  : morgan('combined');
