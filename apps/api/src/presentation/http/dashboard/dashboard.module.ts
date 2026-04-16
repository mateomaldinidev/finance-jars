import { Module } from '@nestjs/common';
import { GetMonthlyDashboardUseCase } from '../../../application/use-cases/get-monthly-dashboard.use-case';
import { DASHBOARD_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { PrismaDashboardRepository } from '../../../infrastructure/prisma/repositories/prisma-dashboard.repository';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: DASHBOARD_REPOSITORY,
      useClass: PrismaDashboardRepository,
    },
    GetMonthlyDashboardUseCase,
  ],
})
export class DashboardModule {}
