import { useState } from 'react';
import type { CreateIncomeInput } from '../hooks/useIncomes';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

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
      setError('El monto debe ser mayor a 0.');
      return;
    }

    if (!formData.currency) {
      setError('Selecciona una moneda.');
      return;
    }

    if (!formData.occurredAt) {
      setError('Selecciona una fecha.');
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
      setError(err instanceof Error ? err.message : 'No se pudo crear el ingreso.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border/20 bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          label="Monto *"
          value={formData.amount}
          onChange={handleChange}
          disabled={isLoading}
        />

        <Select
          id="currency"
          name="currency"
          label="Moneda *"
          value={formData.currency}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </Select>
      </div>

      <Input
        id="occurredAt"
        name="occurredAt"
        type="date"
        label="Fecha *"
        value={
          typeof formData.occurredAt === 'string'
            ? formData.occurredAt
            : new Date(formData.occurredAt).toISOString().split('T')[0]
        }
        onChange={handleChange}
        disabled={isLoading}
      />

      <div className="space-y-1.5">
        <label htmlFor="description" className="font-label text-[10px] uppercase tracking-[0.2em] text-muted">
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
          className="block w-full rounded-lg border border-border/20 bg-cardHighest px-3 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
        />
      </div>

      <Input
        id="tag"
        name="tag"
        type="text"
        label="Etiqueta"
        value={formData.tag || ''}
        onChange={handleChange}
        maxLength={50}
        disabled={isLoading}
        placeholder="ej: salary, bonus, refund"
      />

      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-danger">
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          variant="ghost"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
        >
          {isLoading ? 'Guardando...' : 'Crear Ingreso'}
        </Button>
      </div>
    </form>
  );
}
