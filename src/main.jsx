import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import WorksPage from './pages/WorksPage.jsx'
import SunoPage from './pages/SunoPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }, [pathname])
  return null
}

function RootLayout() {
  return <><ScrollToTop /><Outlet /></>
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/works', element: <WorksPage /> },
      { path: '/works/suno', element: <SunoPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
