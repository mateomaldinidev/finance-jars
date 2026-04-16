export interface JarBalanceRepository {
  getBalance(jarId: string, userId: string): Promise<any>;
}
