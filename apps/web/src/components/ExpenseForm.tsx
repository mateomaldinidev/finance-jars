import { useEffect, useState } from 'react';
import type { CreateExpenseInput, JarBalance } from '../hooks/useExpenses';
import type { Jar } from '../hooks/useJars';

type ExpenseFormProps = {
  jars: Jar[];
  balance: JarBalance | null;
  onJarChange: (jarId: string) => void;
  onSubmit: (data: CreateExpenseInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ExpenseForm({
  jars,
  balance,
  onJarChange,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<CreateExpenseInput>({
    jarId: '',
    amount: 0,
    currency: '',
    occurredAt: new Date().toISOString().slice(0, 10),
    description: '',
    tag: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const selectedJar = jars.find((jar) => jar.id === formData.jarId);
    if (selectedJar && selectedJar.currency !== formData.currency) {
      setFormData((current) => ({
        ...current,
        currency: selectedJar.currency,
      }));
    }
  }, [formData.jarId, formData.currency, jars]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'amount' ? Number(value) : value,
    }));

    if (name === 'jarId') {
      onJarChange(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.jarId) {
      setError('Selecciona un frasco');
      return;
    }

    if (formData.amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="jarId" className="block text-sm text-muted">
            Frasco destino
          </label>
          <select
            id="jarId"
            name="jarId"
            value={formData.jarId}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
          >
            <option value="">Seleccionar frasco</option>
            {jars.map((jar) => (
              <option key={jar.id} value={jar.id}>
                {jar.name} · {jar.currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm text-muted">
            Monto
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="currency" className="block text-sm text-muted">
            Moneda
          </label>
          <input
            id="currency"
            name="currency"
            type="text"
            value={formData.currency}
            onChange={handleChange}
            disabled
            className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-text opacity-70"
          />
        </div>

        <div>
          <label htmlFor="occurredAt" className="block text-sm text-muted">
            Fecha
          </label>
          <input
            id="occurredAt"
            name="occurredAt"
            type="date"
            value={formData.occurredAt}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-muted">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description || ''}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
        />
      </div>

      <div>
        <label htmlFor="tag" className="block text-sm text-muted">
          Tag
        </label>
        <input
          id="tag"
          name="tag"
          type="text"
          value={formData.tag || ''}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-text"
        />
      </div>

      {balance && (
        <div className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-muted">
          Saldo disponible: {Number(balance.balance).toFixed(2)} {balance.currency}
        </div>
      )}

      {error ? (
        <div className="rounded-md border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-4 py-2 text-sm text-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Registrar gasto'}
        </button>
      </div>
    </form>
  );
}