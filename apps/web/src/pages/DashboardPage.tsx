import { useEffect } from 'react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useDashboard } from '../hooks/useDashboard'
import { useAppStore } from '../store/useAppStore'

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function BarChart({
  items,
}: {
  items: Array<{ label: string; value: number; color: string; currency: string }>
}) {
  const maxValue = Math.max(...items.map((item) => Math.abs(Number(item.value))), 1)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{item.label}</span>
            <span className="font-medium text-text">{formatMoney(Number(item.value), item.currency)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(Math.abs(Number(item.value)) / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const { usuario, monedaActiva, periodo, setPeriodo } = useAppStore((state) => state)
  const { dashboard, loading, error, fetchDashboard } = useDashboard()

  useEffect(() => {
    void fetchDashboard(periodo)
  }, [fetchDashboard, periodo])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="mt-0 text-4xl font-bold tracking-tight text-text">Dashboard mensual</h2>
          <p className="text-muted">
            Usuario: {usuario ?? 'sin sesión'} · Mes: {periodo} · Moneda base: {dashboard?.baseCurrency ?? monedaActiva}
          </p>
        </div>

        <div className="w-full max-w-xs">
          <Input
            id="periodo"
            label="Mes"
            type="month"
            value={periodo}
            onChange={(event) => setPeriodo(event.target.value)}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-danger">{error}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Ingresos del mes',
            value: dashboard?.summary.incomes ?? 0,
            color: 'text-green-400',
          },
          {
            label: 'Gastos del mes',
            value: dashboard?.summary.expenses ?? 0,
            color: 'text-red-400',
          },
          {
            label: 'Balance del mes',
            value: dashboard?.summary.balance ?? 0,
            color: 'text-blue-400',
          },
          {
            label: 'Patrimonio neto estimado',
            value: dashboard?.summary.estimatedNetWorth ?? 0,
            color: 'text-amber-300',
          },
        ].map((card) => (
          <Card key={card.label} className="bg-card">
            <h3 className="m-0 font-label text-[10px] uppercase tracking-[0.2em] text-muted">{card.label}</h3>
            <p className={`mb-0 mt-3 text-2xl font-semibold ${card.color}`}>
              {formatMoney(Number(card.value), dashboard?.baseCurrency ?? monedaActiva)}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
        <Card title="Flujo del mes" subtitle="Ingresos, gastos y balance en moneda base." className="bg-cardHigh">
          <div className="mt-4">
            <BarChart items={dashboard?.charts.monthlyFlow ?? []} />
          </div>
        </Card>

        <Card title="Resumen por moneda" className="bg-cardHigh">
          <div className="mt-4 space-y-3">
            {(dashboard?.monthlyByCurrency ?? []).map((item) => (
              <div key={item.currency} className="rounded-lg border border-border/20 bg-bg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text">
                    {item.currency} {item.currency === (dashboard?.baseCurrency ?? monedaActiva) ? <Badge variant="info">base</Badge> : null}
                  </span>
                  <span className="text-sm text-muted">Balance {formatMoney(Number(item.balance), item.currency)}</span>
                </div>
                <div className="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2">
                  <span>Ingresos: {formatMoney(Number(item.incomes), item.currency)}</span>
                  <span>Gastos: {formatMoney(Number(item.expenses), item.currency)}</span>
                </div>
              </div>
            ))}
            {!loading && (dashboard?.monthlyByCurrency.length ?? 0) === 0 ? (
              <p className="text-sm text-muted">No hay movimientos en este mes.</p>
            ) : null}
          </div>
        </Card>
      </div>

      <Card
        title="Saldo por frasco"
        subtitle="Saldo histórico por frasco, sin conversiones entre monedas."
        className="bg-cardHigh"
      >
        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr,1fr]">
          <div>
            <BarChart
              items={
                dashboard?.charts.jarBalances.map((item) => ({
                  ...item,
                  color: item.color,
                })) ?? []
              }
            />
          </div>
          <div className="space-y-3">
            {(dashboard?.jarBalances ?? []).map((jar) => (
              <div key={jar.jarId} className="rounded-lg border border-border/20 bg-bg p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: jar.color }}
                    />
                    <div>
                      <div className="font-medium text-text">{jar.name}</div>
                      <div className="text-xs text-muted">{jar.active ? 'Activo' : 'Inactivo'} · {jar.currency}</div>
                    </div>
                  </div>
                  <span className="font-semibold text-text">{formatMoney(Number(jar.balance), jar.currency)}</span>
                </div>
              </div>
            ))}
            {!loading && (dashboard?.jarBalances.length ?? 0) === 0 ? (
              <p className="text-sm text-muted">Todavía no hay frascos para mostrar.</p>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  )
}
