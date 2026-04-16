import { useEffect, useState } from 'react';
import { useIncomes, type CreateIncomeInput, type DistributionResult } from '../hooks/useIncomes';
import { IncomeForm } from '../components/IncomeForm';
import { DistributionPreview } from '../components/DistributionPreview';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ingresos</h2>
          <p className="mt-2 text-gray-600">Registra y distribuye tus ingresos entre frascos</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Nuevo Ingreso
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Registrar Nuevo Ingreso</h3>
          <IncomeForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
          />
        </div>
      )}

      {loading && !incomes.length && (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando ingresos...</p>
        </div>
      )}

      {!loading && incomes.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No tienes ingresos registrados aún.</p>
          <p className="text-gray-500 text-sm mt-1">¡Crea uno para comenzar a distribuir dinero!</p>
        </div>
      )}

      {incomes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Etiqueta</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{formatDate(income.occurredAt)}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                    {formatAmount(income.amount, income.currency)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {income.description || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {income.tag ? (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {income.tag}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDistribute(income.id)}
                      disabled={distributingId === income.id}
                      className="text-green-600 hover:text-green-800 font-medium text-sm disabled:opacity-50"
                    >
                      {distributingId === income.id ? 'Distribuyendo...' : 'Distribuir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {distributionPreview && (
        <DistributionPreview
          movements={distributionPreview.movements}
          totalAmount={parseFloat(distributionPreview.totalAmount as any)}
          currency={distributionPreview.currency}
          onClose={() => setDistributionPreview(null)}
        />
      )}
    </div>
  );
}
