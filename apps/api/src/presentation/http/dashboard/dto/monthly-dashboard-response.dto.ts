export class DashboardSummaryDto {
  incomes!: any;
  expenses!: any;
  balance!: any;
  estimatedNetWorth!: any;
}

export class DashboardCurrencySummaryDto {
  currency!: string;
  incomes!: any;
  expenses!: any;
  balance!: any;
}

export class DashboardJarBalanceDto {
  jarId!: string;
  name!: string;
  color!: string;
  currency!: string;
  active!: boolean;
  balance!: any;
}

export class DashboardChartDatumDto {
  label!: string;
  value!: any;
  currency!: string;
  color!: string;
}

export class MonthlyDashboardResponseDto {
  month!: string;
  baseCurrency!: string;
  summary!: DashboardSummaryDto;
  monthlyByCurrency!: DashboardCurrencySummaryDto[];
  jarBalances!: DashboardJarBalanceDto[];
  charts!: {
    monthlyFlow: DashboardChartDatumDto[];
    jarBalances: DashboardChartDatumDto[];
  };
}