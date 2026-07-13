import { createBrowserRouter } from 'react-router-dom'

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
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'employees',
        element: <EmployeesPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])