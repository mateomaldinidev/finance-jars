export type IncomeEntity = {
  id: string;
  userId: string;
  amount: any;
  currency: string;
  occurredAt: Date;
  description?: string | null;
  tag?: string | null;
  createdAt: Date;
};
