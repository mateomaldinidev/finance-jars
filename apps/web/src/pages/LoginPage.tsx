import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
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
    <section className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/20">
      <h2 className="mt-0 text-xl">
        {requiresBootstrap ? 'Crear primer usuario local' : 'Ingreso local'}
      </h2>
      <p className="text-sm text-muted">
        {requiresBootstrap
          ? 'No hay usuarios cargados. Crea el usuario inicial para comenzar.'
          : 'Inicia sesion con tu usuario y contrasena local.'}
      </p>
      <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
        <input
          className="rounded-md border border-border bg-bg px-3 py-2 text-text"
          placeholder="Usuario"
          value={usuario}
          autoComplete="username"
          onChange={(e) => setUsuarioInput(e.target.value)}
        />
        <input
          className="rounded-md border border-border bg-bg px-3 py-2 text-text"
          placeholder="Contraseña"
          type="password"
          value={password}
          autoComplete={requiresBootstrap ? 'new-password' : 'current-password'}
          onChange={(e) => setPassword(e.target.value)}
        />
        {authError ? (
          <p className="m-0 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {authError}
          </p>
        ) : null}
        <button
          className="rounded-md border border-accent bg-accent/10 px-3 py-2 font-medium text-text"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? 'Procesando...'
            : requiresBootstrap
              ? 'Crear usuario inicial'
              : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
