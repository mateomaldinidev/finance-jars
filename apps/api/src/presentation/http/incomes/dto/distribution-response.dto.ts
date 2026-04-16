export class DistributionMovementDto {
  jarId!: string;
  jarName!: string;
  amount!: any;
  percentage!: number;
}

export class DistributionResponseDto {
  id!: string;
  incomeMovementId!: string;
  totalAmount!: any;
  currency!: string;
  movements!: DistributionMovementDto[];
  distributedAt!: Date | null;
}
