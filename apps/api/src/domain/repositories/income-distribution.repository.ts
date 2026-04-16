import type { IncomeDistributionEntity } from '../entities/income-distribution.entity';

export interface IncomeDistributionRepository {
  create(
    distribution: Omit<IncomeDistributionEntity, 'id' | 'createdAt'>,
  ): Promise<IncomeDistributionEntity>;
  findByIncomeMovementId(
    incomeMovementId: string,
    userId: string,
  ): Promise<IncomeDistributionEntity | null>;
  updateDistributed(
    id: string,
    distributedAmount: any,
    distributedAt: Date,
  ): Promise<IncomeDistributionEntity>;
}
