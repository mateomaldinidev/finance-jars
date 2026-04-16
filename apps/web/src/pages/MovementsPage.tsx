import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'

export function MovementsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="mt-0 text-4xl font-bold tracking-tight text-text">Movimientos</h2>
        <p className="text-muted">Ledger de ingresos y gastos registrados en el sistema local.</p>
      </header>

      <Card title="Historial" subtitle="Visualización limpia y legible de movimientos">
        <Table columns={['Fecha', 'Descripción', 'Frasco', 'Tipo', 'Monto']}>
          <tr>
            <td className="px-4 py-6 text-sm text-muted" colSpan={5}>
              No hay movimientos para mostrar en esta vista todavía.
            </td>
          </tr>
        </Table>
      </Card>

      <Card className="bg-cardHigh" title="Estado actual">
        <p className="m-0 text-sm text-muted">
          Esta pantalla mantiene sólo el layout visual. No se agregaron filtros ni operaciones nuevas.
        </p>
      </Card>
    </section>
  )
}
