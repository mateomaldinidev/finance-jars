import { useCallback, useState } from 'react';

export interface Expense {
  id: string;
  userId: string;
  jarId: string;
  amount: number;
  currency: string;
  occurredAt: string;
  description?: string | null;
  tag?: string | null;
  createdAt: string;
}

export interface CreateExpenseInput {
  jarId: string;
  amount: number;
  currency: string;
  occurredAt: string;
  description?: string;
  tag?: string;
}

export interface JarBalance {
  jarId: string;
  currency: string;
  balance: number;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/expenses`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar los gastos');
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const createExpense = useCallback(
    async (input: CreateExpenseInput): Promise<Expense | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'No se pudo registrar el gasto');
        }

        const expense = await response.json();
        setExpenses((current) => [expense, ...current]);
        return expense;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  const getJarBalance = useCallback(
    async (jarId: string): Promise<JarBalance | null> => {
      if (!jarId) return null;

      try {
        const response = await fetch(`${baseUrl}/expenses/jars/${jarId}/balance`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'No se pudo consultar el saldo');
        }

        return response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        return null;
      }
    },
    [baseUrl],
  );

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    getJarBalance,
  };
}