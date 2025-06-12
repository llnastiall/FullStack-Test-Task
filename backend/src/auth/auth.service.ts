import { Injectable, UnauthorizedException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterUserDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });

    return this.generateTokens(newUser.id, newUser.email);
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user.id, user.email);
  }

  async refreshTokens(refreshToken: string) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, { secret });
      return this.generateTokens(payload.sub, payload.email);
    } catch (error) {
      const message = error.name === 'TokenExpiredError'
          ? 'Refresh token has expired'
          : 'Invalid refresh token';

      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const access_token = await this.createToken(payload, 'access');
    const refresh_token = await this.createToken(payload, 'refresh');

    return { access_token, refresh_token };
  }

  private async createToken(
      payload: object,
      tokenType: 'access' | 'refresh',
      forMessenger = false,
  ): Promise<string> {
    const secret = tokenType === 'access'
        ? this.configService.get<string>('JWT_ACCESS_SECRET')
        : this.configService.get<string>('JWT_REFRESH_SECRET');

    const expiresIn = tokenType === 'access'
        ? (forMessenger ? '1d' : this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'))
        : (forMessenger ? '7d' : this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'));

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
