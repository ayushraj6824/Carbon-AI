import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar'
import {
  BarChart3Icon,
  SearchIcon,
  LockIcon,
  ZapIcon,
  FileJsonIcon,
  DatabaseIcon,
  KeyIcon,
  WindIcon,
  CodeIcon,
  CpuIcon,
  MicroscopeIcon,
  CheckCircle2Icon,
  LeafIcon,
  ArrowRightIcon
} from "lucide-react"

/* ── Scroll-reveal hook ────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Animated counter ──────────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0)
  const [ref, vis]   = useReveal()
  useEffect(() => {
    if (!vis) return
    let n = 0
    const step = to / 60
    const id = setInterval(() => {
      n += step
      if (n >= to) { setVal(to); clearInterval(id) }
      else setVal(Math.floor(n))
    }, 18)
    return () => clearInterval(id)
  }, [vis, to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const BG      = '#080e1a'
const CARD_BG = 'rgba(255,255,255,0.033)'
const BORDER  = 'rgba(255,255,255,0.07)'
const TEAL    = '#00d4aa'
const MUTED   = 'rgba(255,255,255,0.48)'
const BODY    = 'rgba(255,255,255,0.62)'
const WRAP    = { maxWidth: 1160, margin: '0 auto', padding: '0 28px' }
const SEC_PY  = { padding: '88px 0' }

/* ── Reusable card style ───────────────────────────────────────────────────── */
const card = (extra = {}) => ({
  background: CARD_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 28,
  transition: 'border-color 0.22s ease, transform 0.22s ease',
  ...extra,
})

/* ── Section label ─────────────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <p style={{ color: TEAL, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
    {children}
  </p>
)

/* ── Section heading ───────────────────────────────────────────────────────── */
const H2 = ({ children, style = {} }) => (
  <h2 style={{ color: '#fff', fontSize: 'clamp(1.55rem,2.8vw,2.2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: 14, letterSpacing: '-0.02em', ...style }}>
    {children}
  </h2>
)

/* ── DATA ──────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <BarChart3Icon className="size-8 text-teal-400" />,
    title: 'Emission Analysis',
    desc: 'Linear Regression models compute expected carbon emissions from six operational input dimensions. R² accuracy of 0.88 validated against 18,250 industry records.',
    tag: 'Regression · R² 0.88',
  },
  {
    icon: <SearchIcon className="size-8 text-teal-400" />,
    title: 'Anomaly Detection',
    desc: 'Isolation Forest algorithm identifies statistically anomalous claims. Configurable contamination thresholds adapt to sector-specific emission profiles.',
    tag: 'IsolationForest · 10% threshold',
  },
  {
    icon: <LockIcon className="size-8 text-teal-400" />,
    title: 'Validated Workflow',
    desc: 'End-to-end claim processing with JWT-secured API, role-based access control, persistent audit trail, and structured validation reports.',
    tag: 'JWT · MongoDB · REST API',
  },
]

const STEPS = [
  { n: '01', title: 'Submit Operational Data', desc: 'Enter energy consumption, transport metrics, production output, and declared carbon emissions via structured form.' },
  { n: '02', title: 'AI Emission Analysis', desc: 'The system runs regression prediction and anomaly detection in parallel, generating a scored emission profile.' },
  { n: '03', title: 'Validation Report', desc: 'Receive a structured validation status — VERIFIED or SUSPICIOUS — with confidence score, fraud risk level, and anomaly metrics.' },
]

const STATS = [
  { value: 18250, suffix: '+', label: 'Training records', sub: 'Industry-grade dataset' },
  { value: 88,    suffix: '%', label: 'Regression accuracy', sub: 'R² on held-out test set' },
  { value: 6,     suffix: '',  label: 'Input dimensions', sub: 'Feature engineering pipeline' },
  { value: 10,    suffix: '%', label: 'Anomaly threshold', sub: 'IsolationForest contamination' },
]

const TECH = [
  [<CodeIcon className="size-4" />, 'React 18'],
  [<ZapIcon className="size-4" />, 'Vite'],
  [<CpuIcon className="size-4" />, 'Node.js'],
  [<CpuIcon className="size-4" />, 'Express'],
  [<DatabaseIcon className="size-4" />, 'MongoDB'],
  [<CpuIcon className="size-4" />, 'Flask'],
  [<MicroscopeIcon className="size-4" />, 'Scikit-learn'],
  [<BarChart3Icon className="size-4" />, 'Recharts'],
  [<KeyIcon className="size-4" />, 'JWT'],
  [<WindIcon className="size-4" />, 'Tailwind CSS'],
]

const FOOTER_COLS = [
  { heading: 'Product', links: ['Dashboard', 'Claim History', 'Marketplace'] },
  { heading: 'Access',  links: ['Sign In', 'Register', 'Forgot Password'] },
  { heading: 'Resources', links: ['API Reference', 'Model Documentation', 'Dataset Info'] },
]

/* ── COMPONENT ─────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [featRef, featVis] = useReveal()
  const [workRef, workVis] = useReveal()
  const [statRef, statVis] = useReveal()
  const [techRef, techVis] = useReveal()

  const reveal = (vis, delay = 0) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  })

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff' }}>
      <LandingNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="hero" style={{ position: 'relative', paddingTop: 140, paddingBottom: 96 }}>
        {/* Subtle top gradient wash */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 480,
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,170,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)`,
          backgroundSize: '72px 72px',
          pointerEvents: 'none',
        }} />

        <div style={{ ...WRAP, position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.18)',
            borderRadius: 50, padding: '6px 14px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, display: 'inline-block' }} />
            <span style={{ color: TEAL, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              Carbon Credit Validation Platform
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2rem,4.5vw,3.4rem)', fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.025em', marginBottom: 22, maxWidth: 700,
            color: '#fff',
          }}>
            AI-Driven Emission<br />
            <span style={{ color: TEAL }}>Validation</span> for Enterprise Carbon Audits
          </h1>

          <p style={{ color: BODY, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
            Detect anomalous carbon credit claims using machine learning. Submit operational data and receive a structured validation report in under one second.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 26px', borderRadius: 8,
              background: TEAL, color: '#080e1a', fontWeight: 700,
              fontSize: '0.9rem', textDecoration: 'none', letterSpacing: '-0.01em',
              transition: 'opacity 0.2s ease',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.88'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >Get Started <ArrowRightIcon className="size-4" /></Link>
            <Link to="/login" style={{
              display: 'inline-block', padding: '11px 24px', borderRadius: 8,
              background: 'rgba(255,255,255,0.055)', color: 'rgba(255,255,255,0.8)',
              border: `1px solid ${BORDER}`, fontWeight: 500,
              fontSize: '0.9rem', textDecoration: 'none',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.35)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
            >Sign In</Link>
          </div>

          {/* Key metrics row */}
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', borderTop: `1px solid ${BORDER}`, paddingTop: 28 }}>
            {[['18,250+', 'Training records'], ['R² 0.88', 'Model accuracy'], ['< 1 s', 'Validation latency'], ['2 roles', 'Company · Auditor']].map(([v, l], i) => (
              <div key={i} style={{
                paddingRight: 36, paddingLeft: i > 0 ? 36 : 0,
                borderLeft: i > 0 ? `1px solid ${BORDER}` : 'none',
              }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginBottom: 3 }}>{v}</p>
                <p style={{ color: MUTED, fontSize: '0.78rem' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" style={{ ...SEC_PY, borderTop: `1px solid ${BORDER}` }}>
        <div style={WRAP}>
          <div ref={featRef} style={reveal(featVis)}>
            <SectionLabel>Platform Capabilities</SectionLabel>
            <H2>Structured validation across three analytical layers</H2>
            <p style={{ color: BODY, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}>
              The validation pipeline combines regression-based emission prediction, unsupervised anomaly detection, and secure audit workflow management.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
              {FEATURES.map((f, i) => (
                <div key={i}
                  style={card()}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.22)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ marginBottom: 18 }}>{f.icon}</div>
                  <p style={{
                    display: 'inline-block', marginBottom: 12,
                    background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.15)',
                    borderRadius: 5, padding: '2px 8px', fontSize: '0.67rem',
                    fontWeight: 600, color: TEAL, letterSpacing: '0.04em',
                  }}>{f.tag}</p>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ color: BODY, fontSize: '0.845rem', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ─────────────────────────────────────────────────────── */}
      <section id="workflow" style={{ ...SEC_PY, background: 'rgba(255,255,255,0.015)', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={WRAP}>
          <div ref={workRef} style={reveal(workVis)}>
            <SectionLabel>Workflow</SectionLabel>
            <H2 style={{ marginBottom: 52 }}>From data submission to validated result</H2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 2, position: 'relative' }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ padding: '28px 28px 28px 0', position: 'relative' }}>
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div style={{ display: 'none' }} className="step-connector" />
                  )}
                  {/* Number + line */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 800, color: TEAL, letterSpacing: '0.04em',
                    }}>{s.n}</div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,rgba(0,212,170,0.2),rgba(0,212,170,0.04))` }} />
                    )}
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: BODY, fontSize: '0.835rem', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section style={SEC_PY}>
        <div style={WRAP}>
          <div ref={statRef} style={reveal(statVis)}>
            <SectionLabel>System Metrics</SectionLabel>
            <H2 style={{ marginBottom: 48 }}>Platform performance at a glance</H2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} style={card({ padding: '26px 24px' })}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER }}
                >
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: TEAL, marginBottom: 6, lineHeight: 1 }}>
                    {statVis ? <Counter to={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                  </div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{s.label}</p>
                  <p style={{ color: MUTED, fontSize: '0.75rem' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────────────────────── */}
      <section id="tech" style={{ ...SEC_PY, background: 'rgba(255,255,255,0.015)', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={WRAP}>
          <div ref={techRef} style={reveal(techVis)}>
            <SectionLabel>Technology</SectionLabel>
            <H2 style={{ marginBottom: 12 }}>Built on a modern full-stack architecture</H2>
            <p style={{ color: BODY, fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
              A production-grade stack combining React, Node.js, MongoDB, and a Python Flask ML service with Scikit-learn models.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {TECH.map(([icon, name], i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${BORDER}`,
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,170,0.22)'; e.currentTarget.style.background = 'rgba(255,255,255,0.065)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                >
                  <span style={{ fontSize: 15 }}>{icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.82rem', fontWeight: 500 }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div style={WRAP}>
          <div style={{
            ...card({ padding: '56px 40px', textAlign: 'center', border: '1px solid rgba(0,212,170,0.14)' }),
            background: 'rgba(0,212,170,0.04)',
          }}>
            <p style={{ color: TEAL, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
              Ready to begin
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem,2.8vw,2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2 }}>
              Start validating carbon credit claims today
            </h2>
            <p style={{ color: BODY, fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Create an account to access the full validation dashboard, claim history, and analytics tools.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                display: 'inline-block', padding: '11px 28px', borderRadius: 8,
                background: TEAL, color: '#080e1a', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.target.style.opacity = '0.88'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >Create Account</Link>
              <Link to="/login" style={{
                display: 'inline-block', padding: '11px 24px', borderRadius: 8,
                background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)',
                border: `1px solid ${BORDER}`, fontWeight: 500, fontSize: '0.9rem',
                textDecoration: 'none', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,170,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
              >Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '48px 0 28px' }}>
        <div style={{ ...WRAP, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 36, marginBottom: 40 }}>
          {/* Brand */}
          <div style={{ maxWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#00d4aa,#009e80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                <LeafIcon className="size-4 text-white" />
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>Carbon<span style={{ color: TEAL }}>AI</span></span>
            </div>
            <p style={{ color: MUTED, fontSize: '0.78rem', lineHeight: 1.65 }}>
              AI-driven carbon emission validation and anomaly detection for enterprise sustainability workflows.
            </p>
          </div>

          {/* Footer columns */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{col.heading}</p>
                {col.links.map(l => (
                  <p key={l} style={{ color: MUTED, fontSize: '0.8rem', marginBottom: 9, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = MUTED}
                  >{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...WRAP, borderTop: `1px solid rgba(255,255,255,0.04)`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>© 2024 CarbonAI — Carbon Credit Validation Platform</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>React · Node.js · Flask · Scikit-learn · MongoDB</p>
        </div>
      </footer>
    </div>
  )
}
