import type { ExpenseEntity } from '../entities/expense.entity';

export interface ExpenseRepository {
  create(
    input: Omit<ExpenseEntity, 'id' | 'createdAt'>,
  ): Promise<ExpenseEntity>;
  findById(id: string, userId: string): Promise<ExpenseEntity | null>;
  listByUser(
    userId: string,
    options?: {
      from?: Date;
      to?: Date;
      jarId?: string;
    },
  ): Promise<ExpenseEntity[]>;
}
