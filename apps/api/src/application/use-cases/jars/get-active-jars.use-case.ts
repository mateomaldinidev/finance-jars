import { Injectable } from '@nestjs/common';
import { JarEntity } from '../../../domain/entities/jar.entity';
import { JarRepository } from '../../../domain/repositories/jar.repository';
import { JAR_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { Inject } from '@nestjs/common';

type GetActiveJarsInput = {
  userId: string;
};

@Injectable()
export class GetActiveJarsUseCase {
  constructor(
    @Inject(JAR_REPOSITORY) private readonly jarRepository: JarRepository,
  ) {}

  async execute(input: GetActiveJarsInput): Promise<JarEntity[]> {
    return this.jarRepository.listActiveByUser(input.userId);
  }
}
