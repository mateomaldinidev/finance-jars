import { BadRequestException } from '@nestjs/common';
import { GetMonthlyDashboardUseCase } from './get-monthly-dashboard.use-case';

describe('GetMonthlyDashboardUseCase', () => {
  it('rejects invalid month format', async () => {
    const useCase = new GetMonthlyDashboardUseCase({
      getMonthlyData: jest.fn(),
    } as any);

    await expect(
      useCase.execute({
        userId: 'user-1',
        month: '2026/04',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects out-of-range month numbers', async () => {
    const useCase = new GetMonthlyDashboardUseCase({
      getMonthlyData: jest.fn(),
    } as any);

    await expect(
      useCase.execute({
        userId: 'user-1',
        month: '2026-13',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns formatted dashboard response', async () => {
    const repo = {
      getMonthlyData: jest.fn().mockResolvedValue({
        month: '2026-04',
        baseCurrency: 'ARS',
        incomes: 1000,
        expenses: 400,
        balance: 600,
        estimatedNetWorth: 1600,
        monthlyByCurrency: [
          { currency: 'ARS', incomes: 1000, expenses: 400, balance: 600 },
        ],
        jarBalances: [
          {
            jarId: 'jar-1',
            name: 'Necesidades',
            color: 'blue',
            currency: 'ARS',
            active: true,
            balance: 900,
          },
        ],
      }),
    };

    const useCase = new GetMonthlyDashboardUseCase(repo as any);
    const result = await useCase.execute({
      userId: 'user-1',
      month: '2026-04',
    });

    expect(repo.getMonthlyData).toHaveBeenCalled();
    expect(result.summary.balance).toBe(600);
    expect(result.charts.monthlyFlow).toHaveLength(3);
    expect(result.jarBalances).toHaveLength(1);
  });
});
