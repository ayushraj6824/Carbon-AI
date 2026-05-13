import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts'
import { validateClaim } from '../services/api'
import { useAuth }       from '../context/AuthContext'

const SECTORS    = ['Manufacturing','Energy','Transportation','Agriculture','Construction','Technology','Logistics','Retail']
const SUB_SECTORS = {
  'Manufacturing': ['Steel Manufacturing', 'Cement', 'Textile', 'Automotive', 'Electronics'],
  'Energy': ['Solar', 'Wind', 'Thermal', 'Hydro', 'Nuclear'],
  'Transportation': ['Logistics', 'EV Fleet', 'Aviation', 'Maritime'],
  'Agriculture': ['Crop Farming', 'Livestock', 'Forestry', 'Fertilizer Production'],
  'Construction': ['Residential', 'Commercial', 'Infrastructure', 'Material Production'],
  'Technology': ['Data Centers', 'Software Services', 'Hardware Manufacturing', 'Telecom'],
  'Logistics': ['Warehousing', 'Freight Forwarding', 'Last-mile Delivery', 'Cold Chain'],
  'Retail': ['E-commerce', 'Supermarkets', 'Apparel', 'Electronics Retail']
};
const MODES      = ['Truck','Air','Ship','Rail']
const STRATEGIES = ['Energy Efficiency','Renewable Switch','Carbon Offset','Process Reengineering','Efficiency Upgrade','Carbon Tax Compliance']

const INIT = {
  sector:'Manufacturing', industrySector: SUB_SECTORS['Manufacturing'][0], energyConsumption:'',
  renewableEnergy:'', nonRenewableEnergy:'', productionOutput:'',
  rawMaterialUsage:'', transportDistance:'', transportMode:'Truck',
  processEfficiency:'', carbonReductionStrategy:'Energy Efficiency',
  claimedEmission:'',
}

const Label = ({ children }) => (
  <label className="block text-xs font-semibold mb-1" style={{ color:'rgba(255,255,255,0.5)',letterSpacing:'0.05em' }}>
    {children}
  </label>
)

export default function Dashboard() {
  const { user, saveResult } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [chartData, setChartData] = useState(null)

  const set = (e) => {
    const { name, value } = e.target
    if (name === 'sector') {
      setForm(p => ({ ...p, sector: value, industrySector: SUB_SECTORS[value][0] }))
    } else {
      setForm(p => ({ ...p, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await validateClaim(form)
      saveResult({ ...data, form })
      setChartData({
        energy: [
          { name:'Renewable',    value: parseFloat(form.renewableEnergy)    || 0 },
          { name:'Non-Renewable',value: parseFloat(form.nonRenewableEnergy) || 0 },
        ],
        emission: [
          { name:'Claimed',   value: parseFloat(form.claimedEmission) || 0 },
          { name:'Predicted', value: parseFloat(data.predictedEmission) || 0 },
        ],
      })
      navigate('/result')
    } catch (err) {
      setError(err.response?.data?.message || 'Validation failed. Check that all services are running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Carbon Claim Dashboard</h1>
        <p style={{ color:'rgba(255,255,255,0.45)', marginTop:4 }}>
          Welcome, <span style={{ color:'#00d4aa' }}>{user?.name}</span> — submit operational data to validate your carbon credit claim.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[
          { icon:'🤖', label:'AI Model',  value:'Active',  sub:'Isolation Forest' },
          { icon:'🌱', label:'Algorithm', value:'IsoForest', sub:'Anomaly Detection' },
          { icon:'📡', label:'ML Status', value:'Online',  sub:'Flask :5001' },
        ].map(s => (
          <div key={s.label} className="glass-card glass-card-hover p-5">
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                {s.label}
              </span>
            </div>
            <p className="text-white font-bold text-lg">{s.value}</p>
            <p style={{ color:'#00d4aa', fontSize:'0.75rem' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm"
          style={{ background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.3)',color:'#f87171' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Claim Form */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📝</span> Carbon Credit Claim Form
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(2,1fr)' }}>

            {/* Sector */}
            <div>
              <Label>SECTOR</Label>
              <select className="form-input" name="sector" value={form.sector} onChange={set} id="f-sector">
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Industry Sub-Sector */}
            <div>
              <Label>INDUSTRY SUB-SECTOR</Label>
              <select className="form-input" name="industrySector" value={form.industrySector} onChange={set} id="f-industry">
                {SUB_SECTORS[form.sector]?.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Total Energy */}
            <div>
              <Label>TOTAL ENERGY CONSUMED (kWh)</Label>
              <input className="form-input" type="number" name="energyConsumption" placeholder="e.g. 150000"
                value={form.energyConsumption} onChange={set} required min="0" id="f-energy" />
            </div>

            {/* Renewable Energy */}
            <div>
              <Label>RENEWABLE ENERGY (kWh)</Label>
              <input className="form-input" type="number" name="renewableEnergy" placeholder="e.g. 60000"
                value={form.renewableEnergy} onChange={set} required min="0" id="f-renewable" />
            </div>

            {/* Non-Renewable Energy */}
            <div>
              <Label>NON-RENEWABLE ENERGY (kWh)</Label>
              <input className="form-input" type="number" name="nonRenewableEnergy" placeholder="e.g. 90000"
                value={form.nonRenewableEnergy} onChange={set} required min="0" id="f-nonrenewable" />
            </div>

            {/* Production Output */}
            <div>
              <Label>PRODUCTION OUTPUT (units)</Label>
              <input className="form-input" type="number" name="productionOutput" placeholder="e.g. 5000"
                value={form.productionOutput} onChange={set} required min="0" id="f-production" />
            </div>

            {/* Raw Material Usage */}
            <div>
              <Label>RAW MATERIAL USAGE (kg)</Label>
              <input className="form-input" type="number" name="rawMaterialUsage" placeholder="e.g. 45000"
                value={form.rawMaterialUsage} onChange={set} required min="0" id="f-rawmaterial" />
            </div>

            {/* Transport Distance */}
            <div>
              <Label>TRANSPORT DISTANCE (km)</Label>
              <input className="form-input" type="number" name="transportDistance" placeholder="e.g. 2500"
                value={form.transportDistance} onChange={set} required min="0" id="f-transport" />
            </div>

            {/* Transport Mode */}
            <div>
              <Label>TRANSPORT MODE</Label>
              <select className="form-input" name="transportMode" value={form.transportMode} onChange={set} id="f-mode">
                {MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            {/* Process Efficiency */}
            <div>
              <Label>PROCESS EFFICIENCY (%)</Label>
              <input className="form-input" type="number" name="processEfficiency" placeholder="e.g. 78"
                value={form.processEfficiency} onChange={set} required min="0" max="100" id="f-efficiency" />
            </div>

            {/* Carbon Reduction Strategy */}
            <div>
              <Label>CARBON REDUCTION STRATEGY</Label>
              <select className="form-input" name="carbonReductionStrategy" value={form.carbonReductionStrategy}
                onChange={set} id="f-strategy">
                {STRATEGIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Claimed Emissions */}
            <div>
              <Label>CLAIMED EMISSIONS (tCO2e)</Label>
              <input className="form-input" type="number" name="claimedEmission" placeholder="e.g. 28.5"
                value={form.claimedEmission} onChange={set} required min="0" step="0.01" id="f-claimed" />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
              id="validate-btn"
              style={{ padding:'16px', fontSize:'1rem', letterSpacing:'0.02em' }}
            >
              {loading
                ? '⏳ Running AI Validation…'
                : '🤖 Validate Carbon Credit Claim'}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Charts if chartData exists */}
      {chartData && (
        <div className="grid gap-6" style={{ gridTemplateColumns:'1fr 1fr' }}>
          <div className="glass-card p-6 animate-slide-up">
            <h3 className="text-white font-semibold mb-4">⚡ Energy Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.energy}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={{ background:'#112240',border:'1px solid rgba(0,212,170,0.2)',borderRadius:8,color:'#fff' }} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  <Cell fill="#00d4aa" />
                  <Cell fill="#f87171" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6 animate-slide-up">
            <h3 className="text-white font-semibold mb-4">📊 Emission Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.emission}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={{ background:'#112240',border:'1px solid rgba(0,212,170,0.2)',borderRadius:8,color:'#fff' }} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  <Cell fill="#facc15" />
                  <Cell fill="#00d4aa" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
