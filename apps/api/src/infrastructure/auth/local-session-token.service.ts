import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { SessionTokenService } from '../../application/ports/session-token.port';

@Injectable()
export class LocalSessionTokenService implements SessionTokenService {
  generateToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
