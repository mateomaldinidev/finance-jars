import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { useAppStore } from './store/useAppStore'

function App() {
  const { authStatus, checkSession } = useAppStore((state) => ({
    authStatus: state.authStatus,
    checkSession: state.checkSession,
  }))

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-bg text-text grid place-items-center">
        <p className="text-sm text-muted">Cargando sesion local...</p>
      </div>
    )
  }

  return <RouterProvider router={router} />
}

export default App
