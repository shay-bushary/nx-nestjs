import { Environment } from './environment';

export const environment: Environment = {
  production: false,
  envName: 'development',
  port: 8080,
  host: 'localhost',
  jwtSecret: 'dev-secret',
  jwtAccessExpiry: '15m',
  jwtRefreshExpiry: '7d',
};
