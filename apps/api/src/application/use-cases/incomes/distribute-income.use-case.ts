import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { IncomeRepository } from '../../../domain/repositories/income.repository';
import type { IncomeDistributionRepository } from '../../../domain/repositories/income-distribution.repository';
import type { JarRepository } from '../../../domain/repositories/jar.repository';
import {
  INCOME_REPOSITORY,
  INCOME_DISTRIBUTION_REPOSITORY,
  JAR_REPOSITORY,
} from '../../../domain/repositories/repository.tokens';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { IncomeDistributionCalculatorService } from '../../../infrastructure/services/income-distribution-calculator.service';

type DistributeIncomeInput = {
  incomeMovementId: string;
  userId: string;
};

export interface DistributionMovement {
  jarId: string;
  jarName: string;
  amount: any;
  percentage: number;
}

@Injectable()
export class DistributeIncomeUseCase {
  constructor(
    @Inject(INCOME_REPOSITORY) private readonly incomeRepository: IncomeRepository,
    @Inject(INCOME_DISTRIBUTION_REPOSITORY)
    private readonly distributionRepository: IncomeDistributionRepository,
    @Inject(JAR_REPOSITORY) private readonly jarRepository: JarRepository,
    private readonly prisma: PrismaService,
    private readonly calculator: IncomeDistributionCalculatorService,
  ) {}

  async execute(
    input: DistributeIncomeInput,
  ): Promise<{ movements: DistributionMovement[]; distributionId: string }> {
    // Obtener el ingreso original
    const income = await this.incomeRepository.findById(
      input.incomeMovementId,
      input.userId,
    );
    if (!income) {
      throw new NotFoundException('Income not found');
    }

    // Verificar que no esté ya distribuido
    const existing = await this.distributionRepository.findByIncomeMovementId(
      input.incomeMovementId,
      input.userId,
    );
    if (existing && existing.distributedAt) {
      throw new BadRequestException('Income is already distributed');
    }

    // Obtener frascos activos del usuario
    const activeJars = await this.jarRepository.listActiveByUser(input.userId);

    if (activeJars.length === 0) {
      throw new BadRequestException(
        'No active jars found. Create at least one active jar to distribute income',
      );
    }

    // Validar porcentajes
    const validation = this.calculator.validatePercentages(activeJars);
    if (!validation.valid) {
      throw new BadRequestException(
        `Invalid percentage configuration: ${validation.warning}`,
      );
    }

    // Calcular distribución
    const distributionCalc = this.calculator.calculateDistribution(
      income.amount,
      activeJars,
    );

    // Crear distribución y movimientos en una transacción
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Crear registro de distribución
      const distribution = existing
        ? await tx.incomeDistribution.update({
            where: { id: existing.id },
            data: {
              distributedAt: new Date(),
            },
          })
        : await tx.incomeDistribution.create({
            data: {
              userId: input.userId,
              incomeMovementId: input.incomeMovementId,
              totalAmount: income.amount,
              currency: income.currency,
              distributedAmount: income.amount,
              distributedAt: new Date(),
            },
          });

      // 2. Crear movimientos distribuidos en cada frasco
      const movements = await Promise.all(
        distributionCalc.map((dist) =>
          tx.movement.create({
            data: {
              userId: input.userId,
              jarId: dist.jarId,
              type: 'INCOME',
              amount: dist.amount,
              currency: income.currency,
              occurredAt: income.occurredAt,
              note: `Distributed from income: ${income.description || 'N/A'}`,
              externalRef: `distributed_${input.incomeMovementId}`,
            },
          }),
        ),
      );

      return {
        distribution,
        movements,
      };
    });

    // Retornar resultado
    return {
      movements: distributionCalc,
      distributionId: result.distribution.id,
    };
  }
}
