import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth }      from '../context/AuthContext'

export default function Register() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    setLoading(true)
    try {
      const { data } = await registerUser(form)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background:'linear-gradient(135deg,#0a0f1e 0%,#0d1b2a 60%,#0a1628 100%)' }}
    >
      <div style={{ position:'fixed',top:'20%',right:'10%',width:350,height:350,
        background:'radial-gradient(circle,rgba(0,212,170,0.07) 0%,transparent 70%)',pointerEvents:'none' }} />

      <div className="glass-card animate-fade-in w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4" style={{ width:56,height:56,borderRadius:14,
            background:'linear-gradient(135deg,#00d4aa,#00b896)',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:28 }}>
            🌱
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p style={{ color:'rgba(255,255,255,0.45)',fontSize:'0.875rem',marginTop:4 }}>
            Join Carbon AI Validation System
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
            <label className="block text-xs font-semibold mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>FULL NAME</label>
            <input className="form-input" type="text" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required id="reg-name" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>EMAIL ADDRESS</label>
            <input className="form-input" type="email" name="email" placeholder="company@example.com"
              value={form.email} onChange={handleChange} required id="reg-email" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color:'rgba(255,255,255,0.5)' }}>PASSWORD</label>
            <input className="form-input" type="password" name="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required id="reg-password" />
          </div>

          <button type="submit" className="btn-primary mt-2 w-full" disabled={loading} id="reg-submit">
            {loading ? '⏳ Creating account…' : '🚀 Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color:'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#00d4aa',fontWeight:600,textDecoration:'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
