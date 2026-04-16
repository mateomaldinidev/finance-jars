import { ScryptPasswordHasherService } from './scrypt-password-hasher.service';

describe('ScryptPasswordHasherService', () => {
  const service = new ScryptPasswordHasherService();

  it('hash and verify should work for correct password', async () => {
    const hashed = await service.hash('clave-segura-1234');
    const isValid = await service.verify('clave-segura-1234', hashed);

    expect(isValid).toBe(true);
  });

  it('verify should fail for wrong password', async () => {
    const hashed = await service.hash('clave-segura-1234');
    const isValid = await service.verify('clave-invalida', hashed);

    expect(isValid).toBe(false);
  });
});
