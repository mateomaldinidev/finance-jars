import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JarEntity } from '../../../domain/entities/jar.entity';
import { JarRepository } from '../../../domain/repositories/jar.repository';
import { JAR_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { Inject } from '@nestjs/common';
import { isValidJarColor } from '../../../infrastructure/jars/jar-colors';

type UpdateJarInput = {
  jarId: string;
  userId: string;
  name?: string;
  color?: string;
  description?: string;
  percentageOfIncome?: number;
  currency?: string;
  active?: boolean;
};

@Injectable()
export class UpdateJarUseCase {
  constructor(@Inject(JAR_REPOSITORY) private readonly jarRepository: JarRepository) {}

  async execute(input: UpdateJarInput): Promise<JarEntity> {
    // Verify jar exists and belongs to user
    const existing = await this.jarRepository.findById(input.jarId, input.userId);
    if (!existing) {
      throw new NotFoundException('Jar not found');
    }

    // Validate color if provided
    if (input.color && !isValidJarColor(input.color)) {
      throw new BadRequestException('Invalid jar color');
    }

    // Validate percentage if provided
    if (input.percentageOfIncome !== undefined) {
      if (input.percentageOfIncome < 0 || input.percentageOfIncome > 100) {
        throw new BadRequestException('Percentage must be between 0 and 100');
      }
    }

    // If changing name, verify no duplicate exists
    if (input.name && input.name !== existing.name) {
      const duplicate = await this.jarRepository.findByName(input.name, input.userId);
      if (duplicate) {
        throw new BadRequestException('Jar with this name already exists');
      }
    }

    // Perform update
    const updated = await this.jarRepository.update(input.jarId, input.userId, {
      name: input.name,
      color: input.color,
      description: input.description,
      percentageOfIncome: input.percentageOfIncome,
      currency: input.currency,
      active: input.active,
    } as Partial<JarEntity>);

    if (!updated) {
      throw new NotFoundException('Jar not found');
    }

    return updated;
  }
}
