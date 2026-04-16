import { Injectable, NotFoundException } from '@nestjs/common';
import { JarEntity } from '../../../domain/entities/jar.entity';
import { JarRepository } from '../../../domain/repositories/jar.repository';
import { JAR_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { Inject } from '@nestjs/common';

type GetJarByIdInput = {
  jarId: string;
  userId: string;
};

@Injectable()
export class GetJarByIdUseCase {
  constructor(@Inject(JAR_REPOSITORY) private readonly jarRepository: JarRepository) {}

  async execute(input: GetJarByIdInput): Promise<JarEntity> {
    const jar = await this.jarRepository.findById(input.jarId, input.userId);
    if (!jar) {
      throw new NotFoundException('Jar not found');
    }
    return jar;
  }
}
