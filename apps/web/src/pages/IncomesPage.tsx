import { useEffect, useState } from 'react';
import { useIncomes, type CreateIncomeInput, type DistributionResult } from '../hooks/useIncomes';
import { IncomeForm } from '../components/IncomeForm';
import { DistributionPreview } from '../components/DistributionPreview';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function IncomesPage() {
  const { incomes, loading, error, fetchIncomes, createIncome, distributeIncome } = useIncomes();
  const [showForm, setShowForm] = useState(false);
  const [distributionPreview, setDistributionPreview] = useState<DistributionResult | null>(null);
  const [distributingId, setDistributingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleCreateSubmit = async (data: CreateIncomeInput) => {
    const result = await createIncome(data);
    if (result) {
      setShowForm(false);
    }
  };

  const handleDistribute = async (incomeId: string) => {
    setDistributingId(incomeId);
    const result = await distributeIncome(incomeId);
    setDistributingId(null);
    if (result) {
      setDistributionPreview(result);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-text">Ingresos</h2>
          <p className="mt-2 text-muted">Registra y distribuye tus ingresos entre frascos activos.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="primary" size="lg">
            + Nuevo Ingreso
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-danger">
          {error}
        </div>
      )}

      {showForm && (
        <Card title="Registrar ingreso" className="bg-cardHigh">
          <IncomeForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
          />
        </Card>
      )}

      {loading && !incomes.length && (
        <div className="text-center py-12">
          <p className="text-muted">Cargando ingresos...</p>
        </div>
      )}

      {!loading && incomes.length === 0 && !showForm && (
        <Card className="bg-cardHigh text-center">
          <p className="mb-0 text-muted">No tienes ingresos registrados aún.</p>
          <p className="mt-2 text-sm text-muted/80">Crea uno para comenzar a distribuir dinero.</p>
        </Card>
      )}

      {incomes.length > 0 && (
        <Card title="Historial de ingresos" className="bg-cardHigh">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Etiqueta</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id} className="border-b border-border/10 text-sm text-text">
                    <td className="px-4 py-3">{formatDate(income.occurredAt)}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatAmount(income.amount, income.currency)}
                    </td>
                    <td className="px-4 py-3 text-muted">{income.description || '-'}</td>
                    <td className="px-4 py-3">
                      {income.tag ? <Badge variant="info">{income.tag}</Badge> : <span className="text-muted">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        onClick={() => handleDistribute(income.id)}
                        disabled={distributingId === income.id}
                        size="sm"
                        variant="ghost"
                      >
                        {distributingId === income.id ? 'Distribuyendo...' : 'Distribuir'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {distributionPreview && (
        <DistributionPreview
          movements={distributionPreview.movements}
          totalAmount={Number(distributionPreview.totalAmount)}
          currency={distributionPreview.currency}
          onClose={() => setDistributionPreview(null)}
        />
      )}
    </section>
  );
}
