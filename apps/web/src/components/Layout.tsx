import { Link, Outlet } from 'react-router-dom'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/frascos', label: 'Frascos' },
  { to: '/movimientos', label: 'Movimientos' },
  { to: '/configuracion', label: 'Configuración' },
]

export function Layout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="m-0 text-lg font-semibold">Finance Jars</h1>
            <p className="m-0 text-xs text-muted">Local-first · uso personal</p>
          </div>
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
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
