import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { ExpenseEntity } from '../../../domain/entities/expense.entity';
import type { ExpenseRepository } from '../../../domain/repositories/expense.repository';
import type { JarBalanceRepository } from '../../../domain/repositories/jar-balance.repository';
import type { JarRepository } from '../../../domain/repositories/jar.repository';
import {
  EXPENSE_REPOSITORY,
  JAR_BALANCE_REPOSITORY,
  JAR_REPOSITORY,
} from '../../../domain/repositories/repository.tokens';
import { INCOME_CONSTANTS } from '../../../infrastructure/constants/income-constants';

type CreateExpenseInput = {
  userId: string;
  jarId: string;
  amount: number;
  currency: string;
  occurredAt: Date;
  description?: string;
  tag?: string;
};

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: ExpenseRepository,
    @Inject(JAR_REPOSITORY)
    private readonly jarRepository: JarRepository,
    @Inject(JAR_BALANCE_REPOSITORY)
    private readonly jarBalanceRepository: JarBalanceRepository,
  ) {}

  async execute(input: CreateExpenseInput): Promise<ExpenseEntity> {
    if (input.amount < INCOME_CONSTANTS.MIN_AMOUNT) {
      throw new BadRequestException(
        `Amount must be at least ${INCOME_CONSTANTS.MIN_AMOUNT}`,
      );
    }

    if (!INCOME_CONSTANTS.SUPPORTED_CURRENCIES.includes(input.currency)) {
      throw new BadRequestException(
        `Currency ${input.currency} is not supported`,
      );
    }

    const jar = await this.jarRepository.findById(input.jarId, input.userId);
    if (!jar) {
      throw new NotFoundException('Jar not found');
    }

    if (jar.currency !== input.currency) {
      throw new BadRequestException(
        `Expense currency must match jar currency (${jar.currency})`,
      );
    }

    const balance = new Prisma.Decimal(
      await this.jarBalanceRepository.getBalance(input.jarId, input.userId),
    );
    const amount = new Prisma.Decimal(input.amount);

    if (amount.greaterThan(balance)) {
      throw new BadRequestException(
        `Insufficient funds in jar. Available balance: ${balance.toFixed(2)} ${jar.currency}`,
      );
    }

    return this.expenseRepository.create({
      userId: input.userId,
      jarId: input.jarId,
      amount: input.amount,
      currency: input.currency,
      occurredAt: input.occurredAt,
      description: input.description,
      tag: input.tag,
    });
  }
}