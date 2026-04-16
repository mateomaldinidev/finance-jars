import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { IncomeEntity } from '../../../domain/entities/income.entity';
import type { IncomeRepository } from '../../../domain/repositories/income.repository';
import { INCOME_REPOSITORY } from '../../../domain/repositories/repository.tokens';

type ListIncomesInput = {
  userId: string;
  from?: Date;
  to?: Date;
};

@Injectable()
export class ListIncomesUseCase {
  constructor(
    @Inject(INCOME_REPOSITORY) private readonly incomeRepository: IncomeRepository,
  ) {}

  async execute(input: ListIncomesInput): Promise<IncomeEntity[]> {
    return this.incomeRepository.listByUser(input.userId, {
      from: input.from,
      to: input.to,
    });
  }
}
