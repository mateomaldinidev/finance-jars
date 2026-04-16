export interface SessionTokenService {
  generateToken(): string;
  hashToken(token: string): string;
}
