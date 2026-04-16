import { JarEntity } from '../entities/jar.entity';

export interface JarRepository {
  create(input: {
    userId: string;
    name: string;
    color: string;
    percentageOfIncome: number;
    currency: string;
    description?: string;
  }): Promise<JarEntity>;

  findById(id: string, userId: string): Promise<JarEntity | null>;
  findByName(name: string, userId: string): Promise<JarEntity | null>;
  
  listByUser(
    userId: string,
    options?: { active?: boolean; includeDeleted?: boolean },
  ): Promise<JarEntity[]>;

  listActiveByUser(userId: string): Promise<JarEntity[]>;

  update(
    id: string,
    userId: string,
    input: Partial<{
      name: string;
      color: string;
      percentageOfIncome: number;
      active: boolean;
      description: string | null;
    }>,
  ): Promise<JarEntity | null>;

  softDelete(id: string, userId: string): Promise<void>;
}
