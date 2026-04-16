export type DashboardMonthlyCurrencySummary = {
  currency: string;
  incomes: any;
  expenses: any;
  balance: any;
};

export type DashboardJarBalance = {
  jarId: string;
  name: string;
  color: string;
  currency: string;
  active: boolean;
  balance: any;
};

export type DashboardMonthlyData = {
  month: string;
  baseCurrency: string;
  incomes: any;
  expenses: any;
  balance: any;
  estimatedNetWorth: any;
  monthlyByCurrency: DashboardMonthlyCurrencySummary[];
  jarBalances: DashboardJarBalance[];
};

export interface DashboardRepository {
  getMonthlyData(input: {
    userId: string;
    month: string;
    from: Date;
    to: Date;
  }): Promise<DashboardMonthlyData>;
}