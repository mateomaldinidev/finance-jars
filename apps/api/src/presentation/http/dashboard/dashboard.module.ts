import { Module } from '@nestjs/common';
import { GetMonthlyDashboardUseCase } from '../../../application/use-cases/get-monthly-dashboard.use-case';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [GetMonthlyDashboardUseCase],
})
export class DashboardModule {}
