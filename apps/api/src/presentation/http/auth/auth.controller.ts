import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { BootstrapFirstUserUseCase } from '../../../application/use-cases/bootstrap-first-user.use-case';
import { GetSessionUseCase } from '../../../application/use-cases/get-session.use-case';
import { LoginLocalUseCase } from '../../../application/use-cases/login-local.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import { AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_MAX_AGE_MS } from './constants';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const cookieBaseOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly bootstrapFirstUserUseCase: BootstrapFirstUserUseCase,
    private readonly loginLocalUseCase: LoginLocalUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getSessionUseCase: GetSessionUseCase,
  ) {}

  @Post('bootstrap')
  async bootstrap(
    @Body() body: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.bootstrapFirstUserUseCase.execute(body);
    res.cookie(AUTH_SESSION_COOKIE_NAME, result.sessionToken, {
      ...cookieBaseOptions,
      maxAge: AUTH_SESSION_MAX_AGE_MS,
    });

    return {
      authenticated: true,
      requiresBootstrap: false,
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() body: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginLocalUseCase.execute(body);
    res.cookie(AUTH_SESSION_COOKIE_NAME, result.sessionToken, {
      ...cookieBaseOptions,
      maxAge: AUTH_SESSION_MAX_AGE_MS,
    });

    return {
      authenticated: true,
      requiresBootstrap: false,
      user: result.user,
    };
  }

  @Get('session')
  async getSession(@Req() req: Request) {
    const sessionToken = req.cookies?.[AUTH_SESSION_COOKIE_NAME] as
      | string
      | undefined;
    return this.getSessionUseCase.execute(sessionToken);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionToken = req.cookies?.[AUTH_SESSION_COOKIE_NAME] as
      | string
      | undefined;
    await this.logoutUseCase.execute(sessionToken);
    res.clearCookie(AUTH_SESSION_COOKIE_NAME, cookieBaseOptions);

    return {
      authenticated: false,
      message: 'Sesion cerrada correctamente.',
    };
  }
}
