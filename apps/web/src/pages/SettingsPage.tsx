import { useAppStore } from '../store/useAppStore'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'

export function SettingsPage() {
  const { monedaActiva, setMonedaActiva, periodo, setPeriodo } = useAppStore((state) => ({
    monedaActiva: state.monedaActiva,
    setMonedaActiva: state.setMonedaActiva,
    periodo: state.periodo,
    setPeriodo: state.setPeriodo,
  }))

  return (
    <section className="space-y-6">
      <header>
        <h2 className="mt-0 text-4xl font-bold tracking-tight text-text">Configuración</h2>
        <p className="text-muted">Preferencias locales de lectura para la aplicación.</p>
      </header>

      <Card title="Preferencias visuales y de contexto" subtitle="Cambios locales, sin sincronización externa">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            name="moneda"
            label="Moneda activa"
            value={monedaActiva}
            onChange={(event) => setMonedaActiva(event.target.value as 'ARS' | 'USD' | 'EUR')}
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Select>

          <Input
            id="periodo"
            label="Periodo por defecto"
            type="month"
            value={periodo}
            onChange={(event) => setPeriodo(event.target.value)}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="ghost">Preferencias guardadas localmente</Button>
        </div>
      </Card>
    </section>
  )
}
