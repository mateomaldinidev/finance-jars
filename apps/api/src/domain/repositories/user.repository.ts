import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  countUsers(): Promise<number>;
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  createUser(input: {
    username: string;
    passwordHash: string;
    baseCurrency?: string;
  }): Promise<UserEntity>;
}
