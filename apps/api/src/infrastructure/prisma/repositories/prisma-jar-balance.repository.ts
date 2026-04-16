import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { JarBalanceRepository } from '../../../domain/repositories/jar-balance.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaJarBalanceRepository implements JarBalanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(jarId: string, userId: string): Promise<any> {
    const [incomeAggregate, expenseAggregate] = await Promise.all([
      this.prisma.movement.aggregate({
        where: {
          userId,
          jarId,
          type: 'INCOME',
        },
        _sum: { amount: true },
      }),
      this.prisma.movement.aggregate({
        where: {
          userId,
          jarId,
          type: 'EXPENSE',
        },
        _sum: { amount: true },
      }),
    ]);

    const income = new Prisma.Decimal(incomeAggregate._sum.amount ?? 0);
    const expense = new Prisma.Decimal(expenseAggregate._sum.amount ?? 0);

    return income.minus(expense);
  }
}