import { Environment } from './environment';

export const environment: Environment = {
  production: true,
  envName: 'production',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET!,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
};
