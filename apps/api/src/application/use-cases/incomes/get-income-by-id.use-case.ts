import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { IncomeEntity } from '../../../domain/entities/income.entity';
import type { IncomeRepository } from '../../../domain/repositories/income.repository';
import { INCOME_REPOSITORY } from '../../../domain/repositories/repository.tokens';

type GetIncomeByIdInput = {
  incomeMovementId: string;
  userId: string;
};

@Injectable()
export class GetIncomeByIdUseCase {
  constructor(
    @Inject(INCOME_REPOSITORY) private readonly incomeRepository: IncomeRepository,
  ) {}

  async execute(input: GetIncomeByIdInput): Promise<IncomeEntity> {
    const income = await this.incomeRepository.findById(
      input.incomeMovementId,
      input.userId,
    );

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return income;
  }
}
