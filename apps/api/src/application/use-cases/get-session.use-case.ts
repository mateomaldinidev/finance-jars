import { Inject, Injectable } from '@nestjs/common';
import {
  SESSION_REPOSITORY,
  SESSION_TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../../domain/repositories/repository.tokens';
import type { SessionRepository } from '../../domain/repositories/session.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { SessionTokenService } from '../ports/session-token.port';

@Injectable()
export class GetSessionUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async execute(sessionToken?: string) {
    const usersCount = await this.userRepository.countUsers();

    if (!sessionToken) {
      return {
        authenticated: false,
        requiresBootstrap: usersCount === 0,
        user: null,
      };
    }

    const tokenHash = this.sessionTokenService.hashToken(sessionToken);
    const activeSession = await this.sessionRepository.findActiveByTokenHash(
      tokenHash,
    );

    if (!activeSession) {
      return {
        authenticated: false,
        requiresBootstrap: usersCount === 0,
        user: null,
      };
    }

    const user = await this.userRepository.findById(activeSession.userId);
    if (!user) {
      return {
        authenticated: false,
        requiresBootstrap: usersCount === 0,
        user: null,
      };
    }

    return {
      authenticated: true,
      requiresBootstrap: false,
      user: {
        id: user.id,
        username: user.username,
        baseCurrency: user.baseCurrency,
      },
    };
  }
}
