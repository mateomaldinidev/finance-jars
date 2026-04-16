import { Injectable } from '@nestjs/common';
import type { IncomeEntity } from '../../../domain/entities/income.entity';
import type { IncomeRepository } from '../../../domain/repositories/income.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaIncomeRepository implements IncomeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    income: Omit<IncomeEntity, 'id' | 'createdAt'>,
  ): Promise<IncomeEntity> {
    const created = await this.prisma.movement.create({
      data: {
        userId: income.userId,
        type: 'INCOME',
        amount: income.amount,
        currency: income.currency,
        occurredAt: income.occurredAt,
        note: income.description,
        externalRef: income.tag,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string, userId: string): Promise<IncomeEntity | null> {
    const movement = await this.prisma.movement.findFirst({
      where: {
        id,
        userId,
        type: 'INCOME',
        jarId: null, // Solo movimientos raíz (sin jar asignado)
      },
    });

    return movement ? this.toDomain(movement) : null;
  }

  async listByUser(
    userId: string,
    options?: {
      from?: Date;
      to?: Date;
      jarId?: string;
    },
  ): Promise<IncomeEntity[]> {
    const movements = await this.prisma.movement.findMany({
      where: {
        userId,
        type: 'INCOME',
        ...(options?.from && { occurredAt: { gte: options.from } }),
        ...(options?.to && { occurredAt: { lte: options.to } }),
      },
      orderBy: { occurredAt: 'desc' },
    });

    return movements.map((m) => this.toDomain(m));
  }

  private toDomain(raw: any): IncomeEntity {
    return {
      id: raw.id,
      userId: raw.userId,
      amount: raw.amount,
      currency: raw.currency,
      occurredAt: raw.occurredAt,
      description: raw.note,
      tag: raw.externalRef,
      createdAt: raw.createdAt,
    };
  }
}
