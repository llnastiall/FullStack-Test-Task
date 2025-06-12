import {Controller, Post, Body, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {ApiTags, ApiResponse, ApiBody, ApiOperation, ApiBearerAuth} from '@nestjs/swagger';
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered' })
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User logged in' })
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Оновлення Access та Refresh токенів' })
  @ApiResponse({ status: 200, description: 'Нові токени', schema: {
      example: {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      }
    }})
  async refreshTokens(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshTokens(body.refreshToken);
  }
}