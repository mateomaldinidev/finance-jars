import { NavLink, Outlet } from 'react-router-dom'
import { Button } from './ui/Button'
import { useAppStore } from '../store/useAppStore'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/frascos', label: 'Frascos' },
  { to: '/ingresos', label: 'Ingresos' },
  { to: '/gastos', label: 'Gastos' },
  { to: '/movimientos', label: 'Movimientos' },
  { to: '/configuracion', label: 'Configuración' },
]

export function Layout() {
  const { usuario, logout } = useAppStore((state) => ({
    usuario: state.usuario,
    logout: state.logout,
  }))

  const handleLogout = async () => {
    await logout()
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
      isActive
        ? 'border-r-2 border-accent bg-[#131313] font-semibold text-accent'
        : 'text-muted hover:bg-card hover:text-text',
    ].join(' ')

  return (
    <div className="min-h-screen bg-bg text-text font-body antialiased">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/20 bg-bg px-4 py-8">
        <div className="mb-12 px-2">
          <h1 className="m-0 text-lg font-bold tracking-tight text-primary">Finance Jars</h1>
          <p className="mt-1 font-label text-[10px] uppercase tracking-[0.2em] text-muted">Terminal v1.0</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-border/10 pt-6">
          <Button className="mb-3 w-full" variant="ghost" size="sm" onClick={() => void handleLogout()}>
            Cerrar sesión
          </Button>
          <div className="rounded-lg border border-border/20 bg-card p-3">
            <p className="m-0 text-xs font-semibold text-text">{usuario ?? 'Sin sesión'}</p>
            <p className="m-0 mt-1 font-label text-[10px] uppercase tracking-[0.2em] text-muted">Perfil local</p>
          </div>
        </div>
      </aside>

      <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-16rem)] items-center justify-between bg-bg/70 px-8 backdrop-blur-xl">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border/15 bg-card px-3 py-2 font-label text-[10px] uppercase tracking-[0.2em] text-muted">
            Navegación local · estado consistente
          </div>
        </div>
        <div className="ml-6">
          <Button size="sm" variant="primary">
            Modo local
          </Button>
        </div>
      </header>

      <main className="ml-64 min-h-screen px-8 pb-10 pt-24">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
