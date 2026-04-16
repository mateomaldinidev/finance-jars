import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { JarBalanceRepository } from '../../../domain/repositories/jar-balance.repository';
import type { JarRepository } from '../../../domain/repositories/jar.repository';
import {
  JAR_BALANCE_REPOSITORY,
  JAR_REPOSITORY,
} from '../../../domain/repositories/repository.tokens';

type GetJarBalanceInput = {
  jarId: string;
  userId: string;
};

@Injectable()
export class GetJarBalanceUseCase {
  constructor(
    @Inject(JAR_REPOSITORY)
    private readonly jarRepository: JarRepository,
    @Inject(JAR_BALANCE_REPOSITORY)
    private readonly jarBalanceRepository: JarBalanceRepository,
  ) {}

  async execute(input: GetJarBalanceInput): Promise<{
    jarId: string;
    currency: string;
    balance: any;
  }> {
    const jar = await this.jarRepository.findById(input.jarId, input.userId);
    if (!jar) {
      throw new NotFoundException('Jar not found');
    }

    const balance = await this.jarBalanceRepository.getBalance(
      input.jarId,
      input.userId,
    );

    return {
      jarId: jar.id,
      currency: jar.currency,
      balance,
    };
  }
}
