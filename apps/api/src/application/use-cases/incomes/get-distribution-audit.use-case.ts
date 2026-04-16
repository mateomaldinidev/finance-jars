import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { IncomeDistributionEntity } from '../../../domain/entities/income-distribution.entity';
import type { IncomeDistributionRepository } from '../../../domain/repositories/income-distribution.repository';
import { INCOME_DISTRIBUTION_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

type GetDistributionAuditInput = {
  incomeMovementId: string;
  userId: string;
};

export interface DistributionAudit {
  distribution: IncomeDistributionEntity;
  movements: Array<{
    id: string;
    jarId: string | null;
    jarName?: string;
    amount: any;
    createdAt: Date;
  }>;
}

@Injectable()
export class GetDistributionAuditUseCase {
  constructor(
    @Inject(INCOME_DISTRIBUTION_REPOSITORY)
    private readonly distributionRepository: IncomeDistributionRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: GetDistributionAuditInput): Promise<DistributionAudit> {
    // Obtener distribución
    const distribution =
      await this.distributionRepository.findByIncomeMovementId(
        input.incomeMovementId,
        input.userId,
      );

    if (!distribution) {
      throw new NotFoundException('Distribution not found');
    }

    // Obtener movimientos distribuidos
    const movements = await this.prisma.movement.findMany({
      where: {
        userId: input.userId,
        externalRef: `distributed_${input.incomeMovementId}`,
      },
      include: {
        jar: {
          select: { name: true },
        },
      },
    });

    return {
      distribution,
      movements: movements.map((m) => ({
        id: m.id,
        jarId: m.jarId,
        jarName: m.jar?.name,
        amount: m.amount,
        createdAt: m.createdAt,
      })),
    };
  }
}
