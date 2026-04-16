import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ExpenseEntity } from '../../../domain/entities/expense.entity';
import type { ExpenseRepository } from '../../../domain/repositories/expense.repository';
import { EXPENSE_REPOSITORY } from '../../../domain/repositories/repository.tokens';

type GetExpenseByIdInput = {
  expenseId: string;
  userId: string;
};

@Injectable()
export class GetExpenseByIdUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(input: GetExpenseByIdInput): Promise<ExpenseEntity> {
    const expense = await this.expenseRepository.findById(
      input.expenseId,
      input.userId,
    );

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }
}