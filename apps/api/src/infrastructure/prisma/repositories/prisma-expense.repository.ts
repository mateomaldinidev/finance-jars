import { Injectable } from '@nestjs/common';
import type { ExpenseEntity } from '../../../domain/entities/expense.entity';
import type { ExpenseRepository } from '../../../domain/repositories/expense.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaExpenseRepository implements ExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    input: Omit<ExpenseEntity, 'id' | 'createdAt'>,
  ): Promise<ExpenseEntity> {
    const created = await this.prisma.movement.create({
      data: {
        userId: input.userId,
        jarId: input.jarId,
        type: 'EXPENSE',
        amount: input.amount,
        currency: input.currency,
        occurredAt: input.occurredAt,
        note: input.description,
        externalRef: input.tag,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string, userId: string): Promise<ExpenseEntity | null> {
    const movement = await this.prisma.movement.findFirst({
      where: {
        id,
        userId,
        type: 'EXPENSE',
        jarId: { not: null },
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
  ): Promise<ExpenseEntity[]> {
    const movements = await this.prisma.movement.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        jarId: options?.jarId ?? { not: null },
        ...(options?.from || options?.to
          ? {
              occurredAt: {
                ...(options.from ? { gte: options.from } : {}),
                ...(options.to ? { lte: options.to } : {}),
              },
            }
          : {}),
      },
      orderBy: { occurredAt: 'desc' },
    });

    return movements.map((movement) => this.toDomain(movement));
  }

  private toDomain(raw: any): ExpenseEntity {
    return {
      id: raw.id,
      userId: raw.userId,
      jarId: raw.jarId,
      amount: raw.amount,
      currency: raw.currency,
      occurredAt: raw.occurredAt,
      description: raw.note,
      tag: raw.externalRef,
      createdAt: raw.createdAt,
    };
  }
}
