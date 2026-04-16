import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  DashboardMonthlyData,
  DashboardRepository,
} from '../../../domain/repositories/dashboard.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthlyData(input: {
    userId: string;
    month: string;
    from: Date;
    to: Date;
  }): Promise<DashboardMonthlyData> {
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
      select: { baseCurrency: true },
    });

    const baseCurrency = user?.baseCurrency ?? 'ARS';

    const [
      monthlyRootIncomes,
      monthlyExpenses,
      monthlyByCurrency,
      jars,
      jarMovements,
    ] = await Promise.all([
      this.prisma.movement.aggregate({
        where: {
          userId: input.userId,
          type: 'INCOME',
          jarId: null,
          currency: baseCurrency,
          occurredAt: {
            gte: input.from,
            lt: input.to,
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.movement.aggregate({
        where: {
          userId: input.userId,
          type: 'EXPENSE',
          jarId: { not: null },
          currency: baseCurrency,
          occurredAt: {
            gte: input.from,
            lt: input.to,
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.movement.groupBy({
        by: ['currency', 'type'],
        where: {
          userId: input.userId,
          occurredAt: {
            gte: input.from,
            lt: input.to,
          },
          OR: [
            { type: 'EXPENSE', jarId: { not: null } },
            { type: 'INCOME', jarId: null },
          ],
        },
        _sum: { amount: true },
      }),
      this.prisma.jar.findMany({
        where: {
          userId: input.userId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          color: true,
          currency: true,
          active: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.movement.groupBy({
        by: ['jarId', 'type'],
        where: {
          userId: input.userId,
          jarId: { not: null },
        },
        _sum: { amount: true },
      }),
    ]);

    const incomes = new Prisma.Decimal(monthlyRootIncomes._sum.amount ?? 0);
    const expenses = new Prisma.Decimal(monthlyExpenses._sum.amount ?? 0);
    const balance = incomes.minus(expenses);

    const groupedByCurrency = new Map<
      string,
      { incomes: Prisma.Decimal; expenses: Prisma.Decimal }
    >();

    for (const row of monthlyByCurrency) {
      const current = groupedByCurrency.get(row.currency) ?? {
        incomes: new Prisma.Decimal(0),
        expenses: new Prisma.Decimal(0),
      };

      if (row.type === 'INCOME') {
        current.incomes = new Prisma.Decimal(row._sum.amount ?? 0);
      }

      if (row.type === 'EXPENSE') {
        current.expenses = new Prisma.Decimal(row._sum.amount ?? 0);
      }

      groupedByCurrency.set(row.currency, current);
    }

    const movementTotalsByJar = new Map<
      string,
      { incomes: Prisma.Decimal; expenses: Prisma.Decimal }
    >();

    for (const row of jarMovements) {
      const jarId = row.jarId;
      if (!jarId) continue;

      const current = movementTotalsByJar.get(jarId) ?? {
        incomes: new Prisma.Decimal(0),
        expenses: new Prisma.Decimal(0),
      };

      if (row.type === 'INCOME') {
        current.incomes = new Prisma.Decimal(row._sum.amount ?? 0);
      }

      if (row.type === 'EXPENSE') {
        current.expenses = new Prisma.Decimal(row._sum.amount ?? 0);
      }

      movementTotalsByJar.set(jarId, current);
    }

    const jarBalances = jars.map((jar) => {
      const totals = movementTotalsByJar.get(jar.id) ?? {
        incomes: new Prisma.Decimal(0),
        expenses: new Prisma.Decimal(0),
      };

      return {
        jarId: jar.id,
        name: jar.name,
        color: jar.color,
        currency: jar.currency,
        active: jar.active,
        balance: totals.incomes.minus(totals.expenses),
      };
    });

    const estimatedNetWorth = jarBalances.reduce((sum, jar) => {
      if (jar.currency !== baseCurrency) {
        return sum;
      }

      return sum.plus(jar.balance);
    }, new Prisma.Decimal(0));

    return {
      month: input.month,
      baseCurrency,
      incomes,
      expenses,
      balance,
      estimatedNetWorth,
      monthlyByCurrency: Array.from(groupedByCurrency.entries()).map(
        ([currency, totals]) => ({
          currency,
          incomes: totals.incomes,
          expenses: totals.expenses,
          balance: totals.incomes.minus(totals.expenses),
        }),
      ),
      jarBalances,
    };
  }
}
