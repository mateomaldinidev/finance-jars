import { Injectable } from '@nestjs/common';
import type { IncomeDistributionEntity } from '../../../domain/entities/income-distribution.entity';
import type { IncomeDistributionRepository } from '../../../domain/repositories/income-distribution.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaIncomeDistributionRepository implements IncomeDistributionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    distribution: Omit<IncomeDistributionEntity, 'id' | 'createdAt'>,
  ): Promise<IncomeDistributionEntity> {
    const created = await this.prisma.incomeDistribution.create({
      data: {
        userId: distribution.userId,
        incomeMovementId: distribution.incomeMovementId,
        totalAmount: distribution.totalAmount,
        currency: distribution.currency,
        distributedAmount: distribution.distributedAmount,
        distributedAt: distribution.distributedAt,
      },
    });

    return this.toDomain(created);
  }

  async findByIncomeMovementId(
    incomeMovementId: string,
    userId: string,
  ): Promise<IncomeDistributionEntity | null> {
    const distribution = await this.prisma.incomeDistribution.findFirst({
      where: {
        incomeMovementId,
        userId,
      },
    });

    return distribution ? this.toDomain(distribution) : null;
  }

  async updateDistributed(
    id: string,
    distributedAmount: any,
    distributedAt: Date,
  ): Promise<IncomeDistributionEntity> {
    const updated = await this.prisma.incomeDistribution.update({
      where: { id },
      data: {
        distributedAmount,
        distributedAt,
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(raw: any): IncomeDistributionEntity {
    return {
      id: raw.id,
      userId: raw.userId,
      incomeMovementId: raw.incomeMovementId,
      totalAmount: raw.totalAmount,
      currency: raw.currency,
      distributedAmount: raw.distributedAmount,
      distributedAt: raw.distributedAt,
      createdAt: raw.createdAt,
    };
  }
}
