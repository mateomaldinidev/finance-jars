import { Inject, Injectable } from '@nestjs/common';
import type { ExpenseEntity } from '../../../domain/entities/expense.entity';
import type { ExpenseRepository } from '../../../domain/repositories/expense.repository';
import { EXPENSE_REPOSITORY } from '../../../domain/repositories/repository.tokens';

type ListExpensesInput = {
  userId: string;
  from?: Date;
  to?: Date;
  jarId?: string;
};

@Injectable()
export class ListExpensesUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(input: ListExpensesInput): Promise<ExpenseEntity[]> {
    return this.expenseRepository.listByUser(input.userId, {
      from: input.from,
      to: input.to,
      jarId: input.jarId,
    });
  }
}