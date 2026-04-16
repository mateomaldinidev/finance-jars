import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  countUsers() {
    return this.prisma.user.count();
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  createUser(input: {
    username: string;
    passwordHash: string;
    baseCurrency?: string;
  }) {
    return this.prisma.user.create({
      data: {
        username: input.username,
        passwordHash: input.passwordHash,
        baseCurrency: input.baseCurrency ?? 'ARS',
      },
    });
  }
}
