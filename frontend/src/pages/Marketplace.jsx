const LISTINGS = [
  { id:1, type:'Solar RECs',      amount:'500 credits', price:'$18 / credit',  seller:'SunPower Ltd',    sector:'Energy',         badge:'🌞' },
  { id:2, type:'Wind Energy',     amount:'300 credits', price:'$21 / credit',  seller:'AirFlow Corp',    sector:'Energy',         badge:'💨' },
  { id:3, type:'Reforestation',   amount:'1200 credits',price:'$14 / credit',  seller:'GreenEarth NGO',  sector:'Agriculture',    badge:'🌳' },
  { id:4, type:'Carbon Capture',  amount:'200 credits', price:'$35 / credit',  seller:'CarbonX Tech',    sector:'Technology',     badge:'🏭' },
  { id:5, type:'EV Fleet Offset', amount:'750 credits', price:'$22 / credit',  seller:'GreenMove Inc',   sector:'Transportation', badge:'🚗' },
  { id:6, type:'Biogas Credits',  amount:'400 credits', price:'$19 / credit',  seller:'BioFuel Co',      sector:'Manufacturing',  badge:'⚗️' },
]

export default function Marketplace() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Carbon Marketplace</h1>
        </div>
        <p style={{ color:'rgba(255,255,255,0.45)',fontSize:'0.875rem' }}>
          Browse and trade verified carbon credits from trusted issuers.
        </p>
      </div>

      {/* Stats bar */}
      <div className="glass-card p-5 mb-8 flex gap-8 flex-wrap">
        {[
          { label:'Total Volume', value:'3,350 Credits', icon:'📦' },
          { label:'Avg Price',    value:'$21.50 / credit', icon:'💰' },
          { label:'Sectors',      value:'6 Active',    icon:'🌍' },
          { label:'Sellers',      value:'6 Verified',  icon:'✅' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3">
            <span style={{ fontSize:22 }}>{s.icon}</span>
            <div>
              <p style={{ color:'rgba(255,255,255,0.4)',fontSize:'0.7rem',fontWeight:600,textTransform:'uppercase' }}>{s.label}</p>
              <p className="text-white font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Listings grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {LISTINGS.map(l => (
          <div key={l.id} className="glass-card glass-card-hover p-6">
            <div className="flex items-start justify-between mb-4">
              <span style={{ fontSize:36 }}>{l.badge}</span>
              <span style={{ background:'rgba(0,212,170,0.1)',color:'#00d4aa',
                border:'1px solid rgba(0,212,170,0.2)',borderRadius:6,
                padding:'3px 8px',fontSize:'0.7rem',fontWeight:600 }}>
                {l.sector}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{l.type}</h3>
            <p style={{ color:'rgba(255,255,255,0.4)',fontSize:'0.8rem',marginBottom:16 }}>{l.seller}</p>

            <div className="flex justify-between items-center mb-4">
              <div>
                <p style={{ color:'rgba(255,255,255,0.35)',fontSize:'0.7rem' }}>Available</p>
                <p className="text-white font-semibold">{l.amount}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ color:'rgba(255,255,255,0.35)',fontSize:'0.7rem' }}>Price</p>
                <p style={{ color:'#00d4aa',fontWeight:700 }}>{l.price}</p>
              </div>
            </div>

            <button
              style={{
                width:'100%',padding:'10px',borderRadius:8,
                background:'rgba(0,212,170,0.08)',
                border:'1px solid rgba(0,212,170,0.2)',
                color:'#00d4aa',fontWeight:600,cursor:'pointer',
                fontSize:'0.85rem',
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { e.target.style.background='rgba(0,212,170,0.15)' }}
              onMouseLeave={e => { e.target.style.background='rgba(0,212,170,0.08)' }}
            >
              Purchase Credits →
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card p-6 text-center">
        <p style={{ color:'rgba(255,255,255,0.35)',fontSize:'0.85rem' }}>
          Verified carbon credit listings for demonstration purposes.
        </p>
      </div>
    </div>
  )
}
