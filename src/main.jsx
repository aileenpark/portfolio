import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import WorksPage from './pages/WorksPage.jsx'
import SunoPage from './pages/SunoPage.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/works', element: <WorksPage /> },
  { path: '/works/suno', element: <SunoPage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
