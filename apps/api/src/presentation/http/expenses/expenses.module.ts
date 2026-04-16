import { Module } from '@nestjs/common';
import { CreateExpenseUseCase } from '../../../application/use-cases/expenses/create-expense.use-case';
import { GetExpenseByIdUseCase } from '../../../application/use-cases/expenses/get-expense-by-id.use-case';
import { GetJarBalanceUseCase } from '../../../application/use-cases/expenses/get-jar-balance.use-case';
import { ListExpensesUseCase } from '../../../application/use-cases/expenses/list-expenses.use-case';
import {
  EXPENSE_REPOSITORY,
  JAR_BALANCE_REPOSITORY,
} from '../../../domain/repositories/repository.tokens';
import { PrismaJarBalanceRepository } from '../../../infrastructure/prisma/repositories/prisma-jar-balance.repository';
import { PrismaExpenseRepository } from '../../../infrastructure/prisma/repositories/prisma-expense.repository';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { JarsModule } from '../jars/jars.module';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [PrismaModule, JarsModule],
  controllers: [ExpensesController],
  providers: [
    {
      provide: EXPENSE_REPOSITORY,
      useClass: PrismaExpenseRepository,
    },
    {
      provide: JAR_BALANCE_REPOSITORY,
      useClass: PrismaJarBalanceRepository,
    },
    CreateExpenseUseCase,
    GetExpenseByIdUseCase,
    ListExpensesUseCase,
    GetJarBalanceUseCase,
  ],
  exports: [EXPENSE_REPOSITORY, JAR_BALANCE_REPOSITORY],
})
export class ExpensesModule {}