import { AuthSessionEntity } from '../entities/auth-session.entity';

export interface SessionRepository {
  createSession(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<AuthSessionEntity>;
  findActiveByTokenHash(tokenHash: string): Promise<AuthSessionEntity | null>;
  revokeSessionByTokenHash(tokenHash: string): Promise<void>;
}
