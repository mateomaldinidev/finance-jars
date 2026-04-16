import { useCallback, useState } from 'react';

export interface Jar {
  id: string;
  userId: string;
  name: string;
  color: string;
  description?: string;
  percentageOfIncome: number;
  currency: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJarInput {
  name: string;
  color: string;
  percentageOfIncome: number;
  description?: string;
  currency?: string;
  active?: boolean;
}

export interface UpdateJarInput {
  name?: string;
  color?: string;
  percentageOfIncome?: number;
  description?: string;
  currency?: string;
  active?: boolean;
}

export function useJars() {
  const [jars, setJars] = useState<Jar[]>([]);
  const [activeJars, setActiveJars] = useState<Jar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchJars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/jars`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jars');
      }

      const data = await response.json();
      setJars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const fetchActiveJars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/jars/active`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch active jars');
      }

      const data = await response.json();
      setActiveJars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const createJar = useCallback(
    async (input: CreateJarInput): Promise<Jar | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/jars`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create jar');
        }

        const jar = await response.json();
        setJars((prev) => [...prev, jar]);
        return jar;
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

  const updateJar = useCallback(
    async (jarId: string, input: UpdateJarInput): Promise<Jar | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/jars/${jarId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update jar');
        }

        const jar = await response.json();
        setJars((prev) => prev.map((j) => (j.id === jarId ? jar : j)));
        return jar;
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

  const deleteJar = useCallback(
    async (jarId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/jars/${jarId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to delete jar');
        }

        setJars((prev) => prev.filter((j) => j.id !== jarId));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  return {
    jars,
    activeJars,
    loading,
    error,
    fetchJars,
    fetchActiveJars,
    createJar,
    updateJar,
    deleteJar,
  };
}
