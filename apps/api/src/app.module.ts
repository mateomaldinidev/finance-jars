import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './presentation/http/auth/auth.module';
import { DashboardModule } from './presentation/http/dashboard/dashboard.module';
import { ExpensesModule } from './presentation/http/expenses/expenses.module';
import { HealthModule } from './presentation/http/health/health.module';
import { JarsModule } from './presentation/http/jars/jars.module';
import { MovementsModule } from './presentation/http/movements/movements.module';
import { IncomesModule } from './presentation/http/incomes/incomes.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    JarsModule,
    ExpensesModule,
    MovementsModule,
    IncomesModule,
    DashboardModule,
  ],
})
export class AppModule {}
