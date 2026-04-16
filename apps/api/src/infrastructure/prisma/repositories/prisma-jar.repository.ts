import { Injectable } from '@nestjs/common';
import { JarEntity } from '../../../domain/entities/jar.entity';
import { JarRepository } from '../../../domain/repositories/jar.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaJarRepository implements JarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(jar: Omit<JarEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<JarEntity> {
    const created = await this.prisma.jar.create({
      data: {
        userId: jar.userId,
        name: jar.name,
        color: jar.color,
        description: jar.description,
        percentageOfIncome: jar.percentageOfIncome,
        currency: jar.currency,
        active: jar.active,
        deletedAt: jar.deletedAt,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string, userId: string): Promise<JarEntity | null> {
    const jar = await this.prisma.jar.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
    return jar ? this.toDomain(jar) : null;
  }

  async findByName(name: string, userId: string): Promise<JarEntity | null> {
    const jar = await this.prisma.jar.findFirst({
      where: {
        name,
        userId,
        deletedAt: null,
      },
    });
    return jar ? this.toDomain(jar) : null;
  }

  async listByUser(userId: string): Promise<JarEntity[]> {
    const jars = await this.prisma.jar.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });
    return jars.map((jar) => this.toDomain(jar));
  }

  async listActiveByUser(userId: string): Promise<JarEntity[]> {
    const jars = await this.prisma.jar.findMany({
      where: {
        userId,
        active: true,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });
    return jars.map((jar) => this.toDomain(jar));
  }

  async update(id: string, userId: string, updates: Partial<JarEntity>): Promise<JarEntity | null> {
    const jar = await this.prisma.jar.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!jar) {
      return null;
    }

    const updated = await this.prisma.jar.update({
      where: { id },
      data: {
        name: updates.name ?? undefined,
        color: updates.color ?? undefined,
        description: updates.description ?? undefined,
        percentageOfIncome: updates.percentageOfIncome ?? undefined,
        currency: updates.currency ?? undefined,
        active: updates.active ?? undefined,
      },
    });

    return this.toDomain(updated);
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const jar = await this.prisma.jar.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!jar) {
      return false;
    }

    await this.prisma.jar.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return true;
  }

  private toDomain(raw: any): JarEntity {
    return {
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      color: raw.color,
      description: raw.description,
      percentageOfIncome: raw.percentageOfIncome,
      currency: raw.currency,
      active: raw.active,
      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
