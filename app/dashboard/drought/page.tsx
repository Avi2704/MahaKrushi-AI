'use client';
import { DISTRICTS } from '@/lib/data';

const DROUGHT_DATA = [
  { district: "Latur", severity: "Critical", deficit: -48, ndvi: 0.42, color: "#dc2626" },
  { district: "Osmanabad", severity: "Severe", deficit: -42, ndvi: 0.44, color: "#ef4444" },
  { district: "Beed", severity: "Severe", deficit: -38, ndvi: 0.46, color: "#ef4444" },
  { district: "Solapur", severity: "Moderate", deficit: -28, ndvi: 0.52, color: "#f97316" },
  { district: "Aurangabad", severity: "Moderate", deficit: -22, ndvi: 0.55, color: "#f97316" },
  { district: "Nagpur", severity: "Mild", deficit: -15, ndvi: 0.58, color: "#f59e0b" },
  { district: "Amravati", severity: "Mild", deficit: -12, ndvi: 0.60, color: "#f59e0b" },
  { district: "Nanded", severity: "Moderate", deficit: -25, ndvi: 0.53, color: "#f97316" },
  { district: "Yavatmal", severity: "Mild", deficit: -10, ndvi: 0.62, color: "#f59e0b" },
  { district: "Nashik", severity: "Normal", deficit: +5, ndvi: 0.72, color: "#22c55e" },
  { district: "Pune", severity: "Normal", deficit: +8, ndvi: 0.68, color: "#22c55e" },
  { district: "Kolhapur", severity: "Surplus", deficit: +18, ndvi: 0.78, color: "#16a34a" },
  { district: "Sangli", severity: "Normal", deficit: +2, ndvi: 0.65, color: "#22c55e" },
  { district: "Satara", severity: "Normal", deficit: +5, ndvi: 0.67, color: "#22c55e" },
  { district: "Jalgaon", severity: "Mild", deficit: -8, ndvi: 0.60, color: "#f59e0b" },
  { district: "Ahmednagar", severity: "Mild", deficit: -10, ndvi: 0.61, color: "#f59e0b" },
];

const SEVERITY_ORDER = ["Critical", "Severe", "Moderate", "Mild", "Normal", "Surplus"];

export default function DroughtPage() {
  const sorted = [...DROUGHT_DATA].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>🏜️ Drought Risk Map – Maharashtra</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Real-time rainfall deficit, NDVI-based drought severity across all districts</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Critical', count: DROUGHT_DATA.filter(d => d.severity === 'Critical').length, color: '#dc2626' },
          { label: 'Severe', count: DROUGHT_DATA.filter(d => d.severity === 'Severe').length, color: '#ef4444' },
          { label: 'Moderate', count: DROUGHT_DATA.filter(d => d.severity === 'Moderate').length, color: '#f97316' },
          { label: 'Mild', count: DROUGHT_DATA.filter(d => d.severity === 'Mild').length, color: '#f59e0b' },
          { label: 'Normal+', count: DROUGHT_DATA.filter(d => ['Normal', 'Surplus'].includes(d.severity)).length, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center', borderColor: `${s.color}30` }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{s.label} Risk</div>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem' }}>🚨</span>
        <div>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Drought Alert – Marathwada Region</div>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Latur, Osmanabad, and Beed facing critical rainfall deficit (-40% to -50%). Emergency irrigation relief recommended. CM Drought Fund activated.</div>
        </div>
      </div>

      {/* District Grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>📊 DISTRICT DROUGHT STATUS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem' }}>
          {sorted.map(d => (
            <div key={d.district} style={{ padding: '0.85rem', background: `${d.color}08`, border: `1px solid ${d.color}25`, borderRadius: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: '#e2e8d0', fontSize: '0.85rem' }}>{d.district}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: d.color, background: `${d.color}15`, padding: '0.1rem 0.45rem', borderRadius: '9999px' }}>{d.severity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem' }}>
                <span>Rainfall: <strong style={{ color: d.deficit < 0 ? '#ef4444' : '#22c55e' }}>{d.deficit > 0 ? '+' : ''}{d.deficit}%</strong></span>
                <span>NDVI: <strong style={{ color: d.color }}>{d.ndvi}</strong></span>
              </div>
              <div className="progress-bar">
                <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, (d.ndvi * 100)))}%`, background: d.color, borderRadius: '9999px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>☔ DROUGHT MANAGEMENT ADVISORY</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.75rem' }}>
          {[
            { icon: '💧', title: 'Drip Irrigation', tip: 'Switch to drip irrigation to save 40% water. Apply for PMKSY subsidy through agriculture department.' },
            { icon: '🌱', title: 'Drought-Resistant Crops', tip: 'Shift to sorghum, bajra, or tur varieties that require less water in deficit rainfall zones.' },
            { icon: '💰', title: 'Crop Insurance', tip: 'Enroll in PMFBY before cut-off date. Claim for kharif crop loss due to rainfall deficit.' },
            { icon: '🚜', title: 'Water Harvesting', tip: 'Farm pond construction eligible for subsidy. Contact taluka agriculture office.' },
          ].map(item => (
            <div key={item.title} style={{ padding: '0.85rem', background: 'rgba(34,197,94,0.04)', borderRadius: '0.6rem', border: '1px solid rgba(34,197,94,0.1)' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 600, color: '#e2e8d0', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{item.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>{item.tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
