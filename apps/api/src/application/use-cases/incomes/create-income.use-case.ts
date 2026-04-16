import { Injectable, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { IncomeEntity } from '../../../domain/entities/income.entity';
import type { IncomeRepository } from '../../../domain/repositories/income.repository';
import { INCOME_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { INCOME_CONSTANTS } from '../../../infrastructure/constants/income-constants';

type CreateIncomeInput = {
  userId: string;
  amount: number;
  currency: string;
  occurredAt: Date;
  description?: string;
  tag?: string;
};

@Injectable()
export class CreateIncomeUseCase {
  constructor(
    @Inject(INCOME_REPOSITORY)
    private readonly incomeRepository: IncomeRepository,
  ) {}

  async execute(input: CreateIncomeInput): Promise<IncomeEntity> {
    // Validar monto
    if (input.amount < INCOME_CONSTANTS.MIN_AMOUNT) {
      throw new BadRequestException(
        `Amount must be at least ${INCOME_CONSTANTS.MIN_AMOUNT}`,
      );
    }

    // Validar moneda
    if (!INCOME_CONSTANTS.SUPPORTED_CURRENCIES.includes(input.currency)) {
      throw new BadRequestException(
        `Currency ${input.currency} is not supported`,
      );
    }

    // Validar fecha
    if (input.occurredAt > new Date()) {
      throw new BadRequestException('Occurred date cannot be in the future');
    }

    // Validar descripción
    if (
      input.description &&
      input.description.length > INCOME_CONSTANTS.MAX_DESCRIPTION_LENGTH
    ) {
      throw new BadRequestException(
        `Description cannot exceed ${INCOME_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters`,
      );
    }

    // Validar tag
    if (input.tag && input.tag.length > INCOME_CONSTANTS.MAX_TAG_LENGTH) {
      throw new BadRequestException(
        `Tag cannot exceed ${INCOME_CONSTANTS.MAX_TAG_LENGTH} characters`,
      );
    }

    // Crear ingreso
    const income = await this.incomeRepository.create({
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      occurredAt: input.occurredAt,
      description: input.description,
      tag: input.tag,
    });

    return income;
  }
}
