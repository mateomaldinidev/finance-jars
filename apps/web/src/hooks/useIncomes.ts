import { useCallback, useState } from 'react';

export interface Income {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  occurredAt: Date | string;
  description?: string;
  tag?: string;
  createdAt: Date | string;
}

export interface CreateIncomeInput {
  amount: number;
  currency: string;
  occurredAt: string;
  description?: string;
  tag?: string;
}

export interface DistributionMovement {
  jarId: string;
  jarName: string;
  amount: number;
  percentage: number;
}

export interface DistributionResult {
  id: string;
  incomeMovementId: string;
  totalAmount: number;
  currency: string;
  movements: DistributionMovement[];
  distributedAt: Date | string;
}

export function useIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchIncomes = useCallback(
    async (options?: { from?: Date; to?: Date }) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (options?.from) {
          params.append('from', options.from.toISOString());
        }
        if (options?.to) {
          params.append('to', options.to.toISOString());
        }

        const url = params.toString()
          ? `${baseUrl}/incomes?${params.toString()}`
          : `${baseUrl}/incomes`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch incomes');
        }

        const data = await response.json();
        setIncomes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  const createIncome = useCallback(
    async (input: CreateIncomeInput): Promise<Income | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/incomes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create income');
        }

        const income = await response.json();
        setIncomes((prev) => [income, ...prev]);
        return income;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  const distributeIncome = useCallback(
    async (incomeId: string): Promise<DistributionResult | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/incomes/${incomeId}/distribute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to distribute income');
        }

        const distribution = await response.json();
        return distribution;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  const getDistributionAudit = useCallback(
    async (incomeId: string): Promise<any | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${baseUrl}/incomes/${incomeId}/distribution-audit`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch distribution audit');
        }

        const audit = await response.json();
        return audit;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  return {
    incomes,
    loading,
    error,
    fetchIncomes,
    createIncome,
    distributeIncome,
    getDistributionAudit,
  };
}
