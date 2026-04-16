import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JarEntity } from '../../../domain/entities/jar.entity';
import { JarRepository } from '../../../domain/repositories/jar.repository';
import { JAR_REPOSITORY } from '../../../domain/repositories/repository.tokens';
import { Inject } from '@nestjs/common';
import { isValidJarColor } from '../../../infrastructure/constants/jar-colors';

type CreateJarInput = {
  userId: string;
  name: string;
  color: string;
  percentageOfIncome: number;
  currency?: string;
  description?: string;
  active?: boolean;
};

@Injectable()
export class CreateJarUseCase {
  constructor(
    @Inject(JAR_REPOSITORY) private readonly jarRepository: JarRepository,
  ) {}

  async execute(input: CreateJarInput): Promise<JarEntity> {
    // Validate color
    if (!isValidJarColor(input.color)) {
      throw new BadRequestException('Invalid jar color');
    }

    // Validate percentage
    if (input.percentageOfIncome < 0 || input.percentageOfIncome > 100) {
      throw new BadRequestException('Percentage must be between 0 and 100');
    }

    // Check if name already exists for this user
    const existing = await this.jarRepository.findByName(
      input.name,
      input.userId,
    );
    if (existing) {
      throw new BadRequestException('Jar with this name already exists');
    }

    // Create jar
    const jar = await this.jarRepository.create({
      userId: input.userId,
      name: input.name,
      color: input.color,
      percentageOfIncome: input.percentageOfIncome,
      currency: input.currency || 'USD',
      description: input.description,
      active: input.active ?? true,
      deletedAt: null,
    });

    return jar;
  }
}
