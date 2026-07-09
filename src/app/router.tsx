import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/layouts/app-layout'
import { DashboardPage } from '@/pages/dashboard-page'
import { EmployeesPage } from '@/pages/employees-page'
import { LoginPage } from '@/pages/login-page'
import { NotFoundPage } from '@/pages/not-found-page'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'employees',
            element: <EmployeesPage />,
          },
          {
            path: 'leave',
            element: <NotFoundPage />,
          },
          {
            path: 'leave-types',
            element: <NotFoundPage />,
          },
          {
            path: 'holidays',
            element: <NotFoundPage />,
          },
          {
            path: 'reports',
            element: <NotFoundPage />,
          },
          {
            path: 'settings',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
