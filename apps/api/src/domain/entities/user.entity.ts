export type UserEntity = {
  id: string;
  username: string;
  passwordHash: string;
  baseCurrency: string;
  createdAt: Date;
  updatedAt: Date;
};
