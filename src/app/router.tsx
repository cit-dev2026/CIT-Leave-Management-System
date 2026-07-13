import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>HOME</h1>,
  },
  {
    path: '/login',
    element: <h1>LOGIN</h1>,
  },
])