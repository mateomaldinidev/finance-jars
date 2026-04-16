import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAppStore } from '../store/useAppStore'

export function LoginPage() {
  const navigate = useNavigate()
  const {
    authStatus,
    requiresBootstrap,
    authError,
    clearAuthError,
    login,
    bootstrapFirstUser,
  } = useAppStore((state) => ({
    authStatus: state.authStatus,
    requiresBootstrap: state.requiresBootstrap,
    authError: state.authError,
    clearAuthError: state.clearAuthError,
    login: state.login,
    bootstrapFirstUser: state.bootstrapFirstUser,
  }))
  const [usuario, setUsuarioInput] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (authStatus === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!usuario || !password) return

    clearAuthError()
    setIsSubmitting(true)

    try {
      if (requiresBootstrap) {
        await bootstrapFirstUser({ username: usuario, password })
      } else {
        await login({ username: usuario, password })
      }
      navigate('/dashboard')
    } catch (error) {
      useAppStore.setState({
        authError:
          error instanceof Error
            ? error.message
            : 'No se pudo completar la autenticacion.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-7rem)] place-items-center">
      <Card className="w-full max-w-md border-border/20 bg-cardHigh p-7 shadow-float" title="Acceso local">
        <p className="mb-0 mt-1 text-sm text-muted">
          {requiresBootstrap
            ? 'No hay usuarios cargados. Crea el usuario inicial para comenzar.'
            : 'Ingresá con tu usuario y contraseña local.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            name="usuario"
            label="Usuario"
            placeholder="usuario"
            value={usuario}
            autoComplete="username"
            onChange={(event) => setUsuarioInput(event.target.value)}
          />

          <Input
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            value={password}
            autoComplete={requiresBootstrap ? 'new-password' : 'current-password'}
            onChange={(event) => setPassword(event.target.value)}
          />

          {authError ? (
            <p className="m-0 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {authError}
            </p>
          ) : null}

          <Button className="w-full" variant="primary" size="lg" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? 'Procesando...'
              : requiresBootstrap
                ? 'Crear usuario inicial'
                : 'Entrar'}
          </Button>
        </form>
      </Card>
    </section>
  )
}
