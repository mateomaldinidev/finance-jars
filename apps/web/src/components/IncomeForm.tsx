import { useState } from 'react';
import type { CreateIncomeInput } from '../hooks/useIncomes';

interface IncomeFormProps {
  onSubmit: (data: CreateIncomeInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  defaultCurrency?: string;
}

export function IncomeForm({
  onSubmit,
  onCancel,
  isLoading = false,
  defaultCurrency = 'ARS',
}: IncomeFormProps) {
  const [formData, setFormData] = useState<CreateIncomeInput>({
    amount: 0,
    currency: defaultCurrency,
    occurredAt: new Date().toISOString().split('T')[0],
    description: '',
    tag: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.currency) {
      setError('Currency is required');
      return;
    }

    if (!formData.occurredAt) {
      setError('Date is required');
      return;
    }

    try {
      await onSubmit({
        amount: formData.amount,
        currency: formData.currency,
        occurredAt: new Date(formData.occurredAt).toISOString(),
        description: formData.description,
        tag: formData.tag,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Monto *
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Moneda *
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700">
          Fecha *
        </label>
        <input
          id="occurredAt"
          name="occurredAt"
          type="date"
          value={
            typeof formData.occurredAt === 'string'
              ? formData.occurredAt
              : new Date(formData.occurredAt).toISOString().split('T')[0]
          }
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          maxLength={250}
          rows={3}
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
          Etiqueta
        </label>
        <input
          id="tag"
          name="tag"
          type="text"
          value={formData.tag || ''}
          onChange={handleChange}
          maxLength={50}
          disabled={isLoading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
          placeholder="ej: salary, bonus, refund"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Crear Ingreso'}
        </button>
      </div>
    </form>
  );
}
