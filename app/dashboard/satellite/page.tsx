'use client';
import { useState } from 'react';
import { CROP_HEALTH, DISTRICTS } from '@/lib/data';

export default function SatellitePage() {
  const [district, setDistrict] = useState('Nashik');
  const h = CROP_HEALTH[district] || CROP_HEALTH['Nashik'];
  const allDistricts = Object.keys(CROP_HEALTH);

  const ndviColor = (v: number) => v > 0.65 ? '#22c55e' : v > 0.5 ? '#f59e0b' : '#ef4444';
  const stressColor = (s: string) => s === 'Low' || s === 'Very Low' ? '#22c55e' : s === 'Medium' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>🛰️ Satellite Crop Health Monitoring</h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Real-time NDVI/EVI vegetation index and drought stress detection using Sentinel-2</p>
        </div>
        <select value={district} onChange={e => setDistrict(e.target.value)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          {allDistricts.map(d => <option key={d}>{d}</option>)}
          {DISTRICTS.filter(d => !allDistricts.includes(d.name)).map(d => <option key={d.name}>{d.name}</option>)}
        </select>
      </div>

      {h.anomaly && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Vegetation Anomaly Detected – {district}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{h.recommendation}</div>
          </div>
        </div>
      )}

      {/* NDVI / EVI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'NDVI Score', value: h.ndvi, desc: 'Normalized Difference Vegetation Index (0–1)', icon: '🌿' },
          { label: 'EVI Score', value: h.evi, desc: 'Enhanced Vegetation Index (corrected for atmosphere)', icon: '🛰️' },
        ].map(m => {
          const color = ndviColor(m.value);
          const pct = m.value * 100;
          return (
            <div key={m.label} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>{m.label}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color, marginBottom: '0.25rem' }}>{m.value}</div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)`, backgroundSize: '200px', backgroundPosition: `${(1 - m.value) * 100}% 0`, borderRadius: '4px', transition: 'width 1s' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#4b5563' }}>
                <span>0 (Bare)</span><span></span><span>1 (Dense)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>{m.desc}</div>
            </div>
          );
        })}

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>CROP STATUS</div>
          {[
            { label: 'Growth Stage', value: h.growth },
            { label: 'Crop Stress', value: h.stress, color: stressColor(h.stress) },
            { label: 'Anomaly', value: h.anomaly ? 'Yes' : 'No', color: h.anomaly ? '#ef4444' : '#22c55e' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid rgba(34,197,94,0.08)' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color || '#e2e8d0' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.75rem' }}>🤖 AI ADVISORY FOR {district.toUpperCase()}</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>{h.recommendation}</p>
      </div>

      {/* All Districts Health Overview */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>🗺️ MAHARASHTRA CROP HEALTH OVERVIEW</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.75rem' }}>
          {Object.entries(CROP_HEALTH).map(([name, data]: [string, any]) => {
            const color = ndviColor(data.ndvi);
            return (
              <div key={name} onClick={() => setDistrict(name)} style={{ cursor: 'pointer', padding: '0.85rem', background: district === name ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.04)', border: `1px solid ${district === name ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.1)'}`, borderRadius: '0.6rem', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8d0' }}>{name}</span>
                  {data.anomaly && <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>⚠️</span>}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color }}>{data.ndvi} NDVI</div>
                <div style={{ fontSize: '0.7rem', color: stressColor(data.stress), marginTop: '0.2rem' }}>Stress: {data.stress}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
