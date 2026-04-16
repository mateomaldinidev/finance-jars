import { useAppStore } from '../store/useAppStore'

export function DashboardPage() {
  const { usuario, monedaActiva, periodo } = useAppStore((state) => state)
  return (
    <section>
      <h2 className="mt-0 text-2xl">Dashboard mensual</h2>
      <p className="text-muted">Usuario: {usuario ?? 'sin sesión'} · Mes: {periodo} · Moneda: {monedaActiva}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Ingresos', 'Gastos', 'Ahorro por frascos', 'Balance mensual'].map((card) => (
          <article key={card} className="rounded-lg border border-border bg-card p-4">
            <h3 className="m-0 text-base">{card}</h3>
            <p className="mb-0 mt-2 text-sm text-muted">Bloque base listo para implementar lógica.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
