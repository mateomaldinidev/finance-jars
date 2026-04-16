import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findByUsername(username: string): Promise<UserEntity | null>;
}
