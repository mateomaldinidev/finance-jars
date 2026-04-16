export type ExpenseEntity = {
  id: string;
  userId: string;
  jarId: string;
  amount: any;
  currency: string;
  occurredAt: Date;
  description?: string | null;
  tag?: string | null;
  createdAt: Date;
};