import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { PrismaIncomeRepository } from '../../../infrastructure/prisma/repositories/prisma-income.repository';
import { PrismaIncomeDistributionRepository } from '../../../infrastructure/prisma/repositories/prisma-income-distribution.repository';
import { IncomeDistributionCalculatorService } from '../../../infrastructure/services/income-distribution-calculator.service';
import { CreateIncomeUseCase } from '../../../application/use-cases/incomes/create-income.use-case';
import { DistributeIncomeUseCase } from '../../../application/use-cases/incomes/distribute-income.use-case';
import { GetIncomeByIdUseCase } from '../../../application/use-cases/incomes/get-income-by-id.use-case';
import { ListIncomesUseCase } from '../../../application/use-cases/incomes/list-incomes.use-case';
import { GetDistributionAuditUseCase } from '../../../application/use-cases/incomes/get-distribution-audit.use-case';
import {
  INCOME_REPOSITORY,
  INCOME_DISTRIBUTION_REPOSITORY,
} from '../../../domain/repositories/repository.tokens';

@Module({
  imports: [PrismaModule],
  controllers: [IncomesController],
  providers: [
    {
      provide: INCOME_REPOSITORY,
      useClass: PrismaIncomeRepository,
    },
    {
      provide: INCOME_DISTRIBUTION_REPOSITORY,
      useClass: PrismaIncomeDistributionRepository,
    },
    IncomeDistributionCalculatorService,
    CreateIncomeUseCase,
    DistributeIncomeUseCase,
    GetIncomeByIdUseCase,
    ListIncomesUseCase,
    GetDistributionAuditUseCase,
  ],
  exports: [INCOME_REPOSITORY, INCOME_DISTRIBUTION_REPOSITORY],
})
export class IncomesModule {}
