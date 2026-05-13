import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute   from './components/ProtectedRoute'
import LandingPage      from './pages/LandingPage'
import Login            from './pages/Login'
import Register         from './pages/Register'
import Dashboard        from './pages/Dashboard'
import ValidationResult from './pages/ValidationResult'
import ClaimHistory     from './pages/ClaimHistory'
import Marketplace      from './pages/Marketplace'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — wrapped in sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/result"      element={<ValidationResult />} />
            <Route path="/history"     element={<ClaimHistory />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
