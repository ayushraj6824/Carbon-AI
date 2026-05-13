import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth }   from '../context/AuthContext'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginUser(form)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1b2a 60%,#0a1628 100%)' }}
    >
      {/* Background orbs */}
      <div style={{ position:'fixed',top:'10%',left:'15%',width:400,height:400,
        background:'radial-gradient(circle,rgba(0,212,170,0.08) 0%,transparent 70%)',
        pointerEvents:'none' }} />
      <div style={{ position:'fixed',bottom:'10%',right:'10%',width:300,height:300,
        background:'radial-gradient(circle,rgba(0,100,200,0.08) 0%,transparent 70%)',
        pointerEvents:'none' }} />

      <div className="glass-card animate-fade-in w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4"
            style={{
              width:56,height:56,borderRadius:14,
              background:'linear-gradient(135deg,#00d4aa,#00b896)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:28
            }}
          >🌱</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p style={{ color:'rgba(255,255,255,0.45)',fontSize:'0.875rem',marginTop:4 }}>
            Sign in to Carbon AI Validation System
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm"
            style={{ background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#f87171' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>
              EMAIL ADDRESS
            </label>
            <input
              className="form-input"
              type="email" name="email"
              placeholder="company@example.com"
              value={form.email}
              onChange={handleChange}
              required
              id="login-email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>
              PASSWORD
            </label>
            <input
              className="form-input"
              type="password" name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              id="login-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-2 w-full"
            disabled={loading}
            id="login-submit"
          >
            {loading ? '⏳ Signing in…' : '🔑 Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color:'rgba(255,255,255,0.4)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'#00d4aa',fontWeight:600,textDecoration:'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
