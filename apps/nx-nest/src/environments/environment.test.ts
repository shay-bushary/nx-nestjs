import { Environment } from './environment';

export const environment: Environment = {
  production: false,
  envName: 'test',
  port: 8081,
  host: 'localhost',
  jwtSecret: 'test-secret',
  jwtAccessExpiry: '1m',
  jwtRefreshExpiry: '1h',
};
