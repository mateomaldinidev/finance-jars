import { Injectable, NotFoundException } from '@nestjs/common';
import { JarRepository } from '../../../domain/repositories/jar.repository';
import { JAR_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { Inject } from '@nestjs/common';

type DeleteJarInput = {
  jarId: string;
  userId: string;
};

@Injectable()
export class DeleteJarUseCase {
  constructor(
    @Inject(JAR_REPOSITORY) private readonly jarRepository: JarRepository,
  ) {}

  async execute(input: DeleteJarInput): Promise<void> {
    const deleted = await this.jarRepository.softDelete(
      input.jarId,
      input.userId,
    );
    if (!deleted) {
      throw new NotFoundException('Jar not found');
    }
  }
}
