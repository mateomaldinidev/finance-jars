import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

@Injectable()
export class ScryptPasswordHasherService implements PasswordHasher {
  async hash(plainText: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(plainText, salt, KEY_LENGTH)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async verify(plainText: string, hashedValue: string): Promise<boolean> {
    const [salt, storedKeyHex] = hashedValue.split(':');
    if (!salt || !storedKeyHex) return false;

    const derivedKey = (await scrypt(plainText, salt, KEY_LENGTH)) as Buffer;
    const storedKey = Buffer.from(storedKeyHex, 'hex');

    if (storedKey.length !== derivedKey.length) return false;
    return timingSafeEqual(storedKey, derivedKey);
  }
}
