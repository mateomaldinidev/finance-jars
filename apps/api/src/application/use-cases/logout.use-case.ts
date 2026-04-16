import { Inject, Injectable } from '@nestjs/common';
import {
  SESSION_REPOSITORY,
  SESSION_TOKEN_SERVICE,
} from '../../domain/repositories/repository.tokens';
import type { SessionRepository } from '../../domain/repositories/session.repository';
import type { SessionTokenService } from '../ports/session-token.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(SESSION_TOKEN_SERVICE)
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async execute(sessionToken?: string) {
    if (!sessionToken) return;

    const tokenHash = this.sessionTokenService.hashToken(sessionToken);
    await this.sessionRepository.revokeSessionByTokenHash(tokenHash);
  }
}
