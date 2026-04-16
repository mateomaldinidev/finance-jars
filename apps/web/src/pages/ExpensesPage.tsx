import { useEffect, useState } from 'react';
import { ExpenseForm } from '../components/ExpenseForm';
import { useExpenses, type CreateExpenseInput, type JarBalance } from '../hooks/useExpenses';
import { useJars } from '../hooks/useJars';

export function ExpensesPage() {
  const { jars, fetchJars } = useJars();
  const { expenses, loading, error, fetchExpenses, createExpense, getJarBalance } =
    useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<JarBalance | null>(null);

  useEffect(() => {
    void fetchJars();
    void fetchExpenses();
  }, [fetchExpenses, fetchJars]);

  const handleJarChange = async (jarId: string) => {
    const balance = await getJarBalance(jarId);
    setSelectedBalance(balance);
  };

  const handleSubmit = async (data: CreateExpenseInput) => {
    const created = await createExpense(data);
    if (created) {
      setShowForm(false);
      setSelectedBalance(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text">Gastos</h2>
          <p className="mt-2 text-muted">
            Cada gasto sale manualmente de un frasco y no puede dejarlo en negativo.
          </p>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white"
          >
            + Nuevo gasto
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      {showForm ? (
        <ExpenseForm
          jars={jars}
          balance={selectedBalance}
          onJarChange={handleJarChange}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedBalance(null);
          }}
          isLoading={loading}
        />
      ) : null}

      {!loading && expenses.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-muted">
          No hay gastos registrados todavía.
        </div>
      ) : null}

      {expenses.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-sm text-muted">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Frasco</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Tag</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border/60 text-sm text-text">
                  <td className="px-4 py-3">
                    {new Date(expense.occurredAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {Number(expense.amount).toFixed(2)} {expense.currency}
                  </td>
                  <td className="px-4 py-3">{jars.find((jar) => jar.id === expense.jarId)?.name ?? expense.jarId}</td>
                  <td className="px-4 py-3">{expense.description || '-'}</td>
                  <td className="px-4 py-3">{expense.tag || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}