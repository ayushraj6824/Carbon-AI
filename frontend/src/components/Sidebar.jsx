import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboardIcon,
  FlaskConicalIcon,
  HistoryIcon,
  GlobeIcon,
  LeafIcon,
  SearchIcon,
  Building2Icon,
  LogOutIcon
} from "lucide-react"

const NAV = [
  { to: '/dashboard', icon: <LayoutDashboardIcon className="size-5" />, label: 'Dashboard' },
  { to: '/result', icon: <FlaskConicalIcon className="size-5" />, label: 'Validation' },
  { to: '/history', icon: <HistoryIcon className="size-5" />, label: 'Claim History' },
  { to: '/marketplace', icon: <GlobeIcon className="size-5" />, label: 'Marketplace' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
              flexShrink: 0,
            }}
          >
            <LeafIcon className="size-6 text-white" />
          </div>
          <div>
            <p className=" font-bold text-sm leading-tight">Carbon AI</p>
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
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 16 }}>
        <div className="px-3 mb-3">
          <p className=" text-sm font-semibold truncate">{user?.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }} className="truncate">
            {user?.role === 'auditor' ? (
              <><SearchIcon className="size-3" /> Carbon Auditor</>
            ) : (
              <><Building2Icon className="size-3" /> Company User</>
            )}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full"
          style={{ color: 'rgba(239,68,68,0.7)' }}
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
