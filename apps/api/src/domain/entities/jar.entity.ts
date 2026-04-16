export type JarEntity = {
  id: string;
  userId: string;
  name: string;
  color: string;
  description?: string;
  percentageOfIncome: number;
  currency: string;
  active: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
