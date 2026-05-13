import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { label: 'Platform',   href: '#features'  },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Technology', href: '#tech'      },
]

export default function LandingNavbar() {
  const { token }    = useAuth()
  const navigate     = useNavigate()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const goto = (id) => {
    setMenuOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navBg = scrolled
    ? 'rgba(8,14,26,0.96)'
    : 'rgba(8,14,26,0.5)'

  const navBorder = scrolled
    ? '1px solid rgba(255,255,255,0.07)'
    : '1px solid transparent'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: navBg, borderBottom: navBorder,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 62, gap: 40 }}>

          {/* Logo */}
          <button
            onClick={() => goto('#hero')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}
            aria-label="Home"
          >
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: 'linear-gradient(135deg,#00d4aa,#009e80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>🌱</div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
              Carbon<span style={{ color: '#00d4aa' }}>AI</span>
            </span>
          </button>

          {/* Center links */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {LINKS.map(l => (
              <button key={l.label} onClick={() => goto(l.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.52)', padding: '7px 14px', borderRadius: 7,
                  fontSize: '0.845rem', fontWeight: 500,
                  transition: 'color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.52)'; e.target.style.background = 'none' }}
              >{l.label}</button>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {token ? (
              <button onClick={() => navigate('/dashboard')}
                style={{
                  background: '#00d4aa', border: 'none', cursor: 'pointer',
                  color: '#080e1a', fontWeight: 700, fontSize: '0.845rem',
                  padding: '8px 18px', borderRadius: 7, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.88'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >Go to Dashboard</button>
            ) : (
              <>
                <Link to="/login" style={{
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  padding: '8px 16px', borderRadius: 7, fontSize: '0.845rem', fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >Sign In</Link>
                <Link to="/register" style={{
                  background: '#00d4aa', color: '#080e1a', textDecoration: 'none',
                  padding: '8px 18px', borderRadius: 7, fontSize: '0.845rem', fontWeight: 700,
                  transition: 'opacity 0.2s ease', display: 'inline-block',
                }}
                  onMouseEnter={e => e.target.style.opacity = '0.88'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(o => !o)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, padding: 4 }}
            aria-label="Toggle navigation"
          >{menuOpen ? '✕' : '☰'}</button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
            {LINKS.map(l => (
              <button key={l.label} onClick={() => goto(l.href)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.65)', padding: '10px 4px',
                  fontSize: '0.875rem', fontWeight: 500,
                }}>{l.label}</button>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <Link to="/login" style={{
                flex: 1, textAlign: 'center', padding: '10px', borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
                textDecoration: 'none', fontSize: '0.875rem',
              }}>Sign In</Link>
              <Link to="/register" style={{
                flex: 1, textAlign: 'center', padding: '10px', borderRadius: 7,
                background: '#00d4aa', color: '#080e1a', fontWeight: 700,
                textDecoration: 'none', fontSize: '0.875rem',
              }}>Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
