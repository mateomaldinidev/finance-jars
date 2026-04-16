import { create } from 'zustand'

type CurrencyCode = 'ARS' | 'USD' | 'EUR'

type AppStore = {
  usuario: string | null
  monedaActiva: CurrencyCode
  periodo: string
  setUsuario: (usuario: string | null) => void
  setMonedaActiva: (moneda: CurrencyCode) => void
  setPeriodo: (periodo: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  usuario: null,
  monedaActiva: 'ARS',
  periodo: new Date().toISOString().slice(0, 7),
  setUsuario: (usuario) => set({ usuario }),
  setMonedaActiva: (monedaActiva) => set({ monedaActiva }),
  setPeriodo: (periodo) => set({ periodo }),
}))
