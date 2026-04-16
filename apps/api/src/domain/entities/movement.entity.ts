export type MovementEntity = {
  id: string;
  userId: string;
  jarId: string | null;
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  currency: string;
  occurredAt: string;
};
