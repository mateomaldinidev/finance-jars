import { Global, Module } from '@nestjs/common';
import { BootstrapFirstUserUseCase } from '../../../application/use-cases/bootstrap-first-user.use-case';
import { GetSessionUseCase } from '../../../application/use-cases/get-session.use-case';
import { LoginLocalUseCase } from '../../../application/use-cases/login-local.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import {
  PASSWORD_HASHER,
  SESSION_REPOSITORY,
  SESSION_TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../../../domain/repositories/repository.tokens';
import { LocalSessionTokenService } from '../../../infrastructure/auth/local-session-token.service';
import { ScryptPasswordHasherService } from '../../../infrastructure/auth/scrypt-password-hasher.service';
import { PrismaSessionRepository } from '../../../infrastructure/repositories/prisma-session.repository';
import { PrismaUserRepository } from '../../../infrastructure/repositories/prisma-user.repository';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthGuard,
    BootstrapFirstUserUseCase,
    LoginLocalUseCase,
    LogoutUseCase,
    GetSessionUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SESSION_REPOSITORY, useClass: PrismaSessionRepository },
    { provide: PASSWORD_HASHER, useClass: ScryptPasswordHasherService },
    { provide: SESSION_TOKEN_SERVICE, useClass: LocalSessionTokenService },
  ],
  exports: [
    AuthGuard,
    GetSessionUseCase,
    USER_REPOSITORY,
    SESSION_REPOSITORY,
    SESSION_TOKEN_SERVICE,
  ],
})
export class AuthModule {}
