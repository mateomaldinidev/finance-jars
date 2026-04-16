import { Link, Outlet } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/frascos', label: 'Frascos' },
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

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="m-0 text-lg font-semibold">Finance Jars</h1>
            <p className="m-0 text-xs text-muted">Local-first · uso personal · {usuario ?? 'sin sesion'}</p>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md border border-border px-3 py-1 text-sm text-muted no-underline transition hover:border-accent hover:text-text"
              >
                {link.label}
              </Link>
            ))}
            </nav>
            <button
              className="rounded-md border border-border px-3 py-1 text-sm text-muted transition hover:border-accent hover:text-text"
              onClick={() => void handleLogout()}
              type="button"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
