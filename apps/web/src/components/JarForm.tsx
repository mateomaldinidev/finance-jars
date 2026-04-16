import { useState } from 'react';
import { JAR_COLORS } from '../constants/jar-colors';
import type { Jar, CreateJarInput } from '../hooks/useJars';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface JarFormProps {
  jar?: Jar;
  onSubmit: (data: CreateJarInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function JarForm({ jar, onSubmit, onCancel, isLoading = false }: JarFormProps) {
  const [formData, setFormData] = useState<CreateJarInput>({
    name: jar?.name || '',
    color: jar?.color || 'blue',
    percentageOfIncome: jar?.percentageOfIncome || 0,
    description: jar?.description || '',
    currency: jar?.currency || 'USD',
    active: jar?.active !== false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.percentageOfIncome < 0 || formData.percentageOfIncome > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border/20 bg-card p-4">
      <Input
        id="name"
        name="name"
        type="text"
        label="Nombre del frasco"
        value={formData.name}
        onChange={handleChange}
        maxLength={50}
        disabled={isLoading}
      />

      <Select
        id="color"
        name="color"
        label="Color"
        value={formData.color}
        onChange={handleChange}
        disabled={isLoading}
      >
          {JAR_COLORS.map((color) => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
      </Select>

      <Input
        id="percentageOfIncome"
        name="percentageOfIncome"
        type="number"
        min="0"
        max="100"
        label="Porcentaje de ingreso (%)"
        value={formData.percentageOfIncome}
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
          maxLength={200}
          rows={3}
          disabled={isLoading}
          className="block w-full rounded-lg border border-border/20 bg-cardHighest px-3 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
        />
      </div>

      <Input
        id="currency"
        name="currency"
        type="text"
        label="Moneda"
        value={formData.currency || 'USD'}
        onChange={handleChange}
        disabled={isLoading}
      />

      <div className="flex items-center">
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={formData.active !== false}
          onChange={handleChange}
          disabled={isLoading}
          className="h-4 w-4 cursor-pointer rounded border-border bg-cardHighest text-accent disabled:opacity-50"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-text">
          Activo
        </label>
      </div>

      {error && <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-danger">{error}</div>}

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
          {isLoading ? 'Guardando...' : jar ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
