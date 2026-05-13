import { Navigate, Outlet } from 'react-router-dom'
import { useAuth }          from '../context/AuthContext'
import Sidebar              from './Sidebar'

export default function ProtectedRoute() {
  const { token } = useAuth()

  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
