import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { GetSessionUseCase } from '../../../application/use-cases/get-session.use-case';
import { AUTH_SESSION_COOKIE_NAME } from './constants';

type AuthenticatedRequest = Request & {
  authUser?: {
    id: string;
    username: string;
    baseCurrency: string;
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly getSessionUseCase: GetSessionUseCase) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sessionToken = request.cookies?.[AUTH_SESSION_COOKIE_NAME] as
      | string
      | undefined;

    const session = await this.getSessionUseCase.execute(sessionToken);
    if (!session.authenticated || !session.user) {
      throw new UnauthorizedException('Sesion invalida o expirada.');
    }

    request.authUser = session.user;
    return true;
  }
}
