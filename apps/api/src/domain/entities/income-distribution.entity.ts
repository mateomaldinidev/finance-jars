
export type IncomeDistributionEntity = {
  id: string;
  userId: string;
  incomeMovementId: string;
  totalAmount: any;
  currency: string;
  distributedAmount: any;
  distributedAt: Date | null;
  createdAt: Date;
};
