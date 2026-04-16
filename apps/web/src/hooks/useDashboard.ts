import { useCallback, useState } from 'react';

export type DashboardChartDatum = {
  label: string;
  value: number;
  currency: string;
  color: string;
};

export type DashboardJarBalance = {
  jarId: string;
  name: string;
  color: string;
  currency: string;
  active: boolean;
  balance: number;
};

export type MonthlyDashboard = {
  month: string;
  baseCurrency: string;
  summary: {
    incomes: number;
    expenses: number;
    balance: number;
    estimatedNetWorth: number;
  };
  monthlyByCurrency: Array<{
    currency: string;
    incomes: number;
    expenses: number;
    balance: number;
  }>;
  jarBalances: DashboardJarBalance[];
  charts: {
    monthlyFlow: DashboardChartDatum[];
    jarBalances: DashboardChartDatum[];
  };
};

export function useDashboard() {
  const [dashboard, setDashboard] = useState<MonthlyDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchDashboard = useCallback(async (month: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/dashboard/monthly?month=${month}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || 'No se pudo cargar el dashboard');
      }

      const data = await response.json();
      setDashboard(data);
      return data as MonthlyDashboard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
  };
}