import { Environment } from './environment';

export const environment: Environment = {
  production: false,
  envName: 'stage',
  port: 8080,
  host: '0.0.0.0',
  jwtSecret: 'stage-secret-change-me',
  jwtAccessExpiry: '15m',
  jwtRefreshExpiry: '7d',
};
