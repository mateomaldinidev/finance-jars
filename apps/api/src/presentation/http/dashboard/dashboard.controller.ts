import { Controller, Get, Query } from '@nestjs/common';
import { GetMonthlyDashboardUseCase } from '../../../application/use-cases/get-monthly-dashboard.use-case';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getMonthlyDashboardUseCase: GetMonthlyDashboardUseCase,
  ) {}

  @Get('monthly')
  getMonthly(@Query('month') month = new Date().toISOString().slice(0, 7)) {
    return this.getMonthlyDashboardUseCase.execute({ month });
  }
}
