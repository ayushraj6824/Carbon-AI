import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
  BarChart, Bar, CartesianGrid, XAxis, YAxis
} from 'recharts'
import { getHistory, deleteClaim } from '../services/api'

const COLORS = ['#00d4aa','#f87171','#facc15','#a78bfa','#60a5fa','#fb923c','#34d399','#e879f9']

const fmt    = (n) => (n == null ? '—' : Number(n).toFixed(4))
const fmtPct = (n) => (n == null ? '—' : Number(n).toFixed(1) + '%')

export default function ClaimHistory() {
  const navigate = useNavigate()
  const [claims, setClaims]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = () => {
    setLoading(true)
    getHistory()
      .then(({ data }) => setClaims(data))
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) return;
    try {
      await deleteClaim(id);
      setClaims(claims.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete claim');
    }
  }

  const recentCompareData = claims.slice(0, 5).map((c, i) => ({
    name: new Date(c.createdAt).toLocaleDateString('en-IN', { month:'short', day:'numeric' }) + (i > 0 ? ` (${i})` : ''),
    Claimed: c.claimedEmission || 0,
    Predicted: c.predictedEmission || 0,
  })).reverse();

  // Sector-wise emission totals for pie chart
  const sectorData = Object.entries(
    claims.reduce((acc, c) => {
      acc[c.sector] = (acc[c.sector] || 0) + (c.claimedEmission || 0)
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))

  const stats = {
    total:      claims.length,
    verified:   claims.filter(c => c.status === 'VERIFIED').length,
    suspicious: claims.filter(c => c.status === 'SUSPICIOUS').length,
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Claim History</h1>
        <p style={{ color:'rgba(255,255,255,0.45)',marginTop:4,fontSize:'0.875rem' }}>
          All your submitted carbon credit claims and their validation results.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[
          { icon:'📦', label:'Total Claims',   value: stats.total,     color:'#00d4aa' },
          { icon:'✅', label:'Verified',        value: stats.verified,   color:'#4ade80' },
          { icon:'🚨', label:'Suspicious',      value: stats.suspicious, color:'#f87171' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ color:'rgba(255,255,255,0.45)',fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em' }}>
                {s.label}
              </span>
            </div>
            <p style={{ color: s.color, fontSize:'2rem', fontWeight:800 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pie chart + table side by side */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: sectorData.length ? '340px 1fr' : '1fr' }}>
        {sectorData.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">🌍 Sector-wise Emissions</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sectorData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background:'#112240',border:'1px solid rgba(0,212,170,0.2)',borderRadius:8,color:'#fff' }}
                  formatter={(v) => [`${v} tCO₂e`]}
                />
                <Legend formatter={(v) => <span style={{ color:'rgba(255,255,255,0.7)',fontSize:'0.78rem' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Claims table */}
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">📋 Claims Table</h3>

          {loading && (
            <div className="text-center py-12" style={{ color:'rgba(255,255,255,0.4)' }}>
              ⏳ Loading history…
            </div>
          )}
          {error && (
            <div className="text-center py-8" style={{ color:'#f87171' }}>⚠️ {error}</div>
          )}
          {!loading && !error && claims.length === 0 && (
            <div className="text-center py-12">
              <div style={{ fontSize:48,marginBottom:12 }}>📭</div>
              <p style={{ color:'rgba(255,255,255,0.4)' }}>No claims submitted yet.</p>
              <button className="btn-primary mt-4" onClick={() => navigate('/dashboard')}>
                Submit First Claim
              </button>
            </div>
          )}

          {!loading && claims.length > 0 && (
            <div style={{ overflowX:'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sector</th>
                    <th>Claimed (tCO₂e)</th>
                    <th>Predicted (tCO₂e)</th>
                    <th>Confidence</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map(c => (
                    <tr key={c._id}>
                      <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{c.sector}</td>
                      <td>{fmt(c.claimedEmission)}</td>
                      <td>{fmt(c.predictedEmission)}</td>
                      <td>{fmtPct(c.confidenceScore)}</td>
                      <td>
                        <span className={c.status === 'VERIFIED' ? 'badge-verified'
                          : c.status === 'SUSPICIOUS' ? 'badge-suspicious' : 'badge-pending'}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(c._id)} style={{ color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Delete Claim">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {claims.length > 0 && (
        <div className="glass-card p-6 mb-8 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">📊 Recent Claims: Claimed vs Predicted</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recentCompareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip contentStyle={{ background:'#112240',border:'1px solid rgba(0,212,170,0.2)',borderRadius:8,color:'#fff' }} />
              <Legend formatter={(v) => <span style={{ color:'rgba(255,255,255,0.7)',fontSize:'0.78rem' }}>{v}</span>} />
              <Bar dataKey="Claimed" fill="#facc15" radius={[4,4,0,0]} />
              <Bar dataKey="Predicted" fill="#00d4aa" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
