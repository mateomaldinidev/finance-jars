import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function RequireAuth() {
  const authStatus = useAppStore((state) => state.authStatus)

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
