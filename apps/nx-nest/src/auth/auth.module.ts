import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { environment } from '../environments/environment';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: environment.jwtSecret,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signOptions: { expiresIn: environment.jwtAccessExpiry as any },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
