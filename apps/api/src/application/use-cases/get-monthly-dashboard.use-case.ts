import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MonthQueryDto } from '../dto/month-query.dto';
import type { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { DASHBOARD_REPOSITORY } from '../../domain/repositories/repository.tokens';

@Injectable()
export class GetMonthlyDashboardUseCase {
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async execute({ userId, month }: MonthQueryDto) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestException('Month must use YYYY-MM format');
    }

    const [year, monthNumber] = month.split('-').map(Number);
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(monthNumber) ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      throw new BadRequestException('Month must use a valid YYYY-MM value.');
    }

    const from = new Date(Date.UTC(year, monthNumber - 1, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, monthNumber, 1, 0, 0, 0, 0));

    const data = await this.dashboardRepository.getMonthlyData({
      userId,
      month,
      from,
      to,
    });

    return {
      month: data.month,
      baseCurrency: data.baseCurrency,
      summary: {
        incomes: data.incomes,
        expenses: data.expenses,
        balance: data.balance,
        estimatedNetWorth: data.estimatedNetWorth,
      },
      monthlyByCurrency: data.monthlyByCurrency,
      jarBalances: data.jarBalances,
      charts: {
        monthlyFlow: [
          {
            label: 'Ingresos',
            value: data.incomes,
            currency: data.baseCurrency,
            color: '#16a34a',
          },
          {
            label: 'Gastos',
            value: data.expenses,
            currency: data.baseCurrency,
            color: '#dc2626',
          },
          {
            label: 'Balance',
            value: data.balance,
            currency: data.baseCurrency,
            color: '#2563eb',
          },
        ],
        jarBalances: data.jarBalances.map((jar) => ({
          label: jar.name,
          value: jar.balance,
          currency: jar.currency,
          color: jar.color,
        })),
      },
    };
  }
}
