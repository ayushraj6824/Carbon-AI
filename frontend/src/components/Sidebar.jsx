import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard',   icon: '🏠', label: 'Dashboard'   },
  { to: '/result',      icon: '🔬', label: 'Validation'  },
  { to: '/history',     icon: '📋', label: 'Claim History'},
  { to: '/marketplace', icon: '🌍', label: 'Marketplace' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className="flex flex-col"
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'rgba(10,15,30,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 12px',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg,#00d4aa,#00b896)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}
          >🌱</div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Carbon AI</p>
            <p style={{ color: '#00d4aa', fontSize: '0.7rem' }}>Validation System</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: 17 }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 16 }}>
        <div className="px-3 mb-3">
          <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }} className="truncate">
            {user?.role === 'auditor' ? '🔍 Carbon Auditor' : '🏢 Company User'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full"
          style={{ color: 'rgba(239,68,68,0.7)' }}
        >
          <span style={{ fontSize: 17 }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
