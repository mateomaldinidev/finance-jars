import { GetMonthlyDashboardUseCase } from './application/use-cases/get-monthly-dashboard.use-case';

describe('GetMonthlyDashboardUseCase', () => {
  it('should return scaffold monthly payload', () => {
    const useCase = new GetMonthlyDashboardUseCase();

    expect(useCase.execute({ month: '2026-04' })).toEqual({
      month: '2026-04',
      summary: 'Base de dashboard mensual lista para implementar métricas.',
    });
  });
});
