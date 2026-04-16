import { create } from 'zustand'

type CurrencyCode = 'ARS' | 'USD' | 'EUR'
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type SessionUser = {
  id: string
  username: string
  baseCurrency: CurrencyCode
}

type SessionResponse = {
  authenticated: boolean
  requiresBootstrap: boolean
  user: SessionUser | null
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const body = (await response.json()) as T & { message?: string }
  if (!response.ok) {
    throw new Error(body.message ?? 'No se pudo completar la operacion.')
  }

  return body
}

type AppStore = {
  usuario: string | null
  monedaActiva: CurrencyCode
  periodo: string
  authStatus: AuthStatus
  requiresBootstrap: boolean
  authError: string | null
  setUsuario: (usuario: string | null) => void
  setMonedaActiva: (moneda: CurrencyCode) => void
  setPeriodo: (periodo: string) => void
  checkSession: () => Promise<void>
  login: (input: { username: string; password: string }) => Promise<void>
  bootstrapFirstUser: (input: {
    username: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  clearAuthError: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  usuario: null,
  monedaActiva: 'ARS',
  periodo: new Date().toISOString().slice(0, 7),
  authStatus: 'loading',
  requiresBootstrap: false,
  authError: null,
  setUsuario: (usuario) => set({ usuario }),
  setMonedaActiva: (monedaActiva) => set({ monedaActiva }),
  setPeriodo: (periodo) => set({ periodo }),
  clearAuthError: () => set({ authError: null }),
  checkSession: async () => {
    try {
      const session = await apiFetch<SessionResponse>('/auth/session')
      set({
        usuario: session.user?.username ?? null,
        monedaActiva: session.user?.baseCurrency ?? 'ARS',
        authStatus: session.authenticated ? 'authenticated' : 'unauthenticated',
        requiresBootstrap: session.requiresBootstrap,
        authError: null,
      })
    } catch {
      set({
        authStatus: 'unauthenticated',
        requiresBootstrap: false,
        authError: 'No se pudo validar la sesion.',
      })
    }
  },
  login: async ({ username, password }) => {
    const session = await apiFetch<SessionResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    set({
      usuario: session.user?.username ?? null,
      monedaActiva: session.user?.baseCurrency ?? 'ARS',
      authStatus: 'authenticated',
      requiresBootstrap: false,
      authError: null,
    })
  },
  bootstrapFirstUser: async ({ username, password }) => {
    const session = await apiFetch<SessionResponse>('/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    set({
      usuario: session.user?.username ?? null,
      monedaActiva: session.user?.baseCurrency ?? 'ARS',
      authStatus: 'authenticated',
      requiresBootstrap: false,
      authError: null,
    })
  },
  logout: async () => {
    await apiFetch('/auth/logout', { method: 'POST' })
    set({
      usuario: null,
      authStatus: 'unauthenticated',
      requiresBootstrap: false,
      authError: null,
    })
  },
}))
