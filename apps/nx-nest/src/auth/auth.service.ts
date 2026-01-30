import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
} from '@nx-shay/shared';
import { UsersService } from '../users/users.service.js';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterRequest,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) {
      throw new ConflictException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const stored = await this.usersService.create(dto.username, passwordHash);
    const tokens = this.generateTokens(stored.id, stored.username);
    return { user: this.usersService.toPublicUser(stored), tokens };
  }

  async login(
    dto: LoginRequest,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const stored = await this.usersService.findByUsername(dto.username);
    if (!stored) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, stored.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(stored.id, stored.username);
    return { user: this.usersService.toPublicUser(stored), tokens };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: environment.jwtSecret,
      });
      const accessToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        { expiresIn: environment.jwtAccessExpiry },
      );
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(userId: string, username: string): AuthTokens {
    const payload = { sub: userId, username };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: environment.jwtAccessExpiry,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: environment.jwtRefreshExpiry,
    });
    return { accessToken, refreshToken };
  }
}
