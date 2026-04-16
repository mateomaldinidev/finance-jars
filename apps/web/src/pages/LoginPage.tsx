import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setUsuario = useAppStore((state) => state.setUsuario)
  const [usuario, setUsuarioInput] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!usuario || !password) return
    setUsuario(usuario)
    navigate('/dashboard')
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/20">
      <h2 className="mt-0 text-xl">Ingreso local</h2>
      <p className="text-sm text-muted">Preparado para auth local por usuario y contraseña.</p>
      <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
        <input
          className="rounded-md border border-border bg-bg px-3 py-2 text-text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuarioInput(e.target.value)}
        />
        <input
          className="rounded-md border border-border bg-bg px-3 py-2 text-text"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="rounded-md border border-accent bg-accent/10 px-3 py-2 font-medium text-text" type="submit">
          Entrar
        </button>
      </form>
    </section>
  )
}
