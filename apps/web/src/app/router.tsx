import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { RequireAuth } from '../components/RequireAuth'
import { DashboardPage } from '../pages/DashboardPage'
import { JarsPage } from '../pages/JarsPage'
import { LoginPage } from '../pages/LoginPage'
import { MovementsPage } from '../pages/MovementsPage'
import { SettingsPage } from '../pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/frascos', element: <JarsPage /> },
          { path: '/movimientos', element: <MovementsPage /> },
          { path: '/configuracion', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
