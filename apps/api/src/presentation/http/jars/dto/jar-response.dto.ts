export class JarResponseDto {
  id!: string;
  userId!: string;
  name!: string;
  color!: string;
  description?: string | null;
  percentageOfIncome!: number;
  currency!: string;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
