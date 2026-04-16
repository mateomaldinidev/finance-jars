import type { IncomeEntity } from '../entities/income.entity';

export interface IncomeRepository {
  create(income: Omit<IncomeEntity, 'id' | 'createdAt'>): Promise<IncomeEntity>;
  findById(id: string, userId: string): Promise<IncomeEntity | null>;
  listByUser(
    userId: string,
    options?: {
      from?: Date;
      to?: Date;
      jarId?: string;
    },
  ): Promise<IncomeEntity[]>;
}
