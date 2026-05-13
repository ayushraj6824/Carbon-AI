import { useNavigate }   from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend,
} from 'recharts'
import { useAuth } from '../context/AuthContext'

const MetricCard = ({ icon, label, value, sub, color = '#00d4aa' }) => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-3">
      <span style={{ fontSize:20 }}>{icon}</span>
      <span style={{ color:'rgba(255,255,255,0.45)',fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em' }}>
        {label}
      </span>
    </div>
    <p style={{ color, fontSize:'1.6rem', fontWeight:800, lineHeight:1 }}>{value}</p>
    {sub && <p style={{ color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',marginTop:4 }}>{sub}</p>}
  </div>
)

export default function ValidationResult() {
  const { lastResult } = useAuth()
  const navigate       = useNavigate()

  if (!lastResult) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center" style={{ minHeight:'60vh' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔬</div>
        <h2 className="text-white text-2xl font-bold mb-2">No Result Yet</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', marginBottom:24 }}>Submit a claim from the Dashboard first.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>← Go to Dashboard</button>
      </div>
    )
  }

  const {
    predictedEmission, anomalyScore, fraudProbability,
    confidenceScore, fraudRiskLevel, status, form, claim,
  } = lastResult

  const isVerified = status === 'VERIFIED'
  const accentColor  = isVerified ? '#4ade80' : '#f87171'
  const accentBg     = isVerified ? 'rgba(34,197,94,0.08)'  : 'rgba(239,68,68,0.08)'
  const accentBorder = isVerified ? 'rgba(34,197,94,0.25)'  : 'rgba(239,68,68,0.25)'

  const emissionData = [
    { name:'Claimed',   value: parseFloat(form?.claimedEmission) || 0, fill:'#facc15' },
    { name:'Predicted', value: parseFloat(predictedEmission) || 0,     fill:'#00d4aa'  },
  ]
  const safeConfidence = parseFloat(confidenceScore) || 0;
  const gaugeData = [{ name:'Confidence', value: safeConfidence, fill: accentColor }]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')}
          style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:8,padding:'8px 14px',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:'0.85rem' }}>
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Validation Result</h1>
          <p style={{ color:'rgba(255,255,255,0.45)',marginTop:2,fontSize:'0.875rem' }}>
            AI-powered anomaly detection analysis
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className="glass-card mb-8 p-7 animate-slide-up"
        style={{ background: accentBg, border:`1px solid ${accentBorder}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div style={{ fontSize:56 }}>{isVerified ? '✅' : '🚨'}</div>
            <div>
              <div style={{ color: accentColor, fontSize:'0.8rem', fontWeight:700,
                textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>
                Claim Status
              </div>
              <div style={{ color: accentColor, fontSize:'2.5rem', fontWeight:900, lineHeight:1 }}>
                {status}
              </div>
              <div style={{ color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:'0.875rem' }}>
                {isVerified
                  ? 'Claim is consistent with predicted emissions and within normal range.'
                  : 'Anomaly detected. Claim deviates significantly from ML prediction.'}
              </div>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:'rgba(255,255,255,0.4)',fontSize:'0.72rem',marginBottom:4 }}>Fraud Risk Level</div>
            <div style={{
              padding:'8px 20px', borderRadius:8, fontWeight:700, fontSize:'1.2rem',
              background: fraudRiskLevel==='Low' ? 'rgba(34,197,94,0.2)'
                : fraudRiskLevel==='Medium' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
              color: fraudRiskLevel==='Low' ? '#4ade80' : fraudRiskLevel==='Medium' ? '#facc15' : '#f87171',
              border:`1px solid ${fraudRiskLevel==='Low' ? 'rgba(34,197,94,0.3)' : fraudRiskLevel==='Medium' ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              {fraudRiskLevel} Risk
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
        <MetricCard icon="🎯" label="Predicted Emission" value={`${(parseFloat(predictedEmission) || 0).toFixed(2)} tCO₂e`} sub="ML Regression" color="#00d4aa" />
        <MetricCard icon="📋" label="Claimed Emission"   value={`${(parseFloat(form?.claimedEmission) || 0).toFixed(2)} tCO₂e`} sub="Company reported" color="#facc15" />
        <MetricCard icon="🔬" label="Anomaly Score"      value={`${((parseFloat(anomalyScore) || 0) * 100).toFixed(1)}%`} sub="IsolationForest" color={accentColor} />
        <MetricCard icon="💡" label="Confidence Score"   value={`${(parseFloat(confidenceScore) || 0).toFixed(1)}%`}      sub="Model confidence" color="#a78bfa" />
      </div>

      {/* Charts */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-5 text-center">📊 Claimed vs Predicted Emission</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={emissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip contentStyle={{ background:'#112240',border:'1px solid rgba(0,212,170,0.2)',borderRadius:8,color:'#fff' }}
                formatter={(v) => [`${v.toFixed(4)} tCO₂e`]} />
              <Bar dataKey="value" radius={[6,6,0,0]} barSize={100}>
                {emissionData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details table */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-5">🔍 Submission Details</h3>
        <div className="grid gap-3" style={{ gridTemplateColumns:'1fr 1fr', fontSize:'0.875rem' }}>
          {[
            ['Sector',            form?.sector],
            ['Industry',          form?.industrySector || '—'],
            ['Transport Mode',    form?.transportMode],
            ['Transport Distance',`${parseFloat(form?.transportDistance)?.toLocaleString()} km`],
            ['Process Efficiency',`${form?.processEfficiency}%`],
            ['Strategy',          form?.carbonReductionStrategy],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between items-center py-2"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color:'rgba(255,255,255,0.4)' }}>{k}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>🔄 New Claim</button>
          <button onClick={() => navigate('/history')}
            style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:10,padding:'12px 20px',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:'0.9rem' }}>
            📋 View History
          </button>
        </div>
      </div>
    </div>
  )
}
