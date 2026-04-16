import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { PasswordHasher } from '../ports/password-hasher.port';
import type { SessionTokenService } from '../ports/session-token.port';
import {
  PASSWORD_HASHER,
  SESSION_REPOSITORY,
  SESSION_TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../../domain/repositories/repository.tokens';
import type { SessionRepository } from '../../domain/repositories/session.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { AuthPayload } from './bootstrap-first-user.use-case';

@Injectable()
export class LoginLocalUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async execute({ username, password }: AuthPayload) {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const isValidPassword = await this.passwordHasher.verify(
      password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const sessionToken = this.sessionTokenService.generateToken();
    const tokenHash = this.sessionTokenService.hashToken(sessionToken);
    await this.sessionRepository.createSession({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    return {
      sessionToken,
      user: {
        id: user.id,
        username: user.username,
        baseCurrency: user.baseCurrency,
      },
    };
  }
}
