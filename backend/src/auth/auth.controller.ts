import { Body, Controller, Post, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { AuthService, TokenPayload } from './auth.service';
import type { Request, Response } from 'express';
import { RegisterInput } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard, JwtRefreshGuard } from './guards';

interface AuthRequest extends Request {
  user: { userId: number; email: string };
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Post('register')
  async registerUser(
    @Body() registerInput: RegisterInput
  ) {
    return await this.authService.registerUser(registerInput);
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() loginInput: LoginDto
  ) {
    const tokens = await this.authService.login(loginInput);
    const ENV = this.configService.get<string>('ENVIRONMENT');

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: ENV === 'PRODUCTION',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { accessToken: tokens.accessToken, user: tokens.user };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshAuth(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const user = req.user as unknown as TokenPayload;

    const tokens = await this.authService.generateTokens({
      userId: user.userId,
      email: user.email,
    });

    // Rotate the refresh token cookie
    const ENV = this.configService.get<string>('ENVIRONMENT');

    const publicUser = await this.authService.getPublicUserById(user.userId);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: ENV === 'PRODUCTION',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken, user: publicUser };
  }



  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get('ENVIRONMENT') === 'PRODUCTION',
      sameSite: 'lax',
    });

    return {
      message: 'Logged out successfully',
    };
  }

}