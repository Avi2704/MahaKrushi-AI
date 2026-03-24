'use client';
import { useState } from 'react';
import { PEST_RISKS, DISTRICTS } from '@/lib/data';

export default function PestPage() {
  const [district, setDistrict] = useState('Nagpur');
  const pest = PEST_RISKS[district];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>🐛 Pest Outbreak Prediction</h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>AI-predicted pest outbreak risk based on climate, humidity, crop history</p>
        </div>
        <select value={district} onChange={e => setDistrict(e.target.value)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          {[...Object.keys(PEST_RISKS), ...DISTRICTS.filter(d => !Object.keys(PEST_RISKS).includes(d.name)).map(d => d.name)].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Current District Risk */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        {pest ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>PEST RISK – {district.toUpperCase()}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pest.color === 'red' ? '#ef4444' : pest.color === 'amber' ? '#f59e0b' : '#22c55e', marginBottom: '0.4rem' }}>
                {pest.pest}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>Affects: <strong style={{ color: '#e2e8d0' }}>{pest.crop}</strong></div>
              <div className="progress-bar" style={{ marginBottom: '0.5rem', height: '10px' }}>
                <div className="progress-fill" style={{ width: `${pest.score * 100}%`, background: pest.color === 'red' ? '#ef4444' : pest.color === 'amber' ? '#f59e0b' : '#22c55e', height: '10px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
                <span>Risk Score: {Math.round(pest.score * 100)}%</span>
                <span>Level: <strong style={{ color: pest.color === 'red' ? '#ef4444' : pest.color === 'amber' ? '#f59e0b' : '#22c55e' }}>{pest.level}</strong></span>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: '0.6rem', padding: '0.9rem', fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6 }}>
                <strong style={{ color: '#22c55e' }}>💊 Advisory:</strong> {pest.advice}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                background: `conic-gradient(${pest.color === 'red' ? '#ef4444' : pest.color === 'amber' ? '#f59e0b' : '#22c55e'} ${pest.score * 360}deg, rgba(255,255,255,0.05) 0deg)`,
                position: 'relative',
              }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#0d1a0e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'absolute' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: pest.color === 'red' ? '#ef4444' : pest.color === 'amber' ? '#f59e0b' : '#22c55e' }}>{Math.round(pest.score * 100)}%</div>
                  <div style={{ fontSize: '0.55rem', color: '#6b7280' }}>RISK</div>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>{pest.level}</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#22c55e' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontWeight: 600 }}>No significant pest risk detected for {district}.</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.5rem' }}>Continue regular field monitoring and preventive measures.</div>
          </div>
        )}
      </div>

      {/* All Districts Pest Map */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>🗺️ MAHARASHTRA PEST RISK MAP</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem' }}>
          {Object.entries(PEST_RISKS).map(([name, p]: [string, any]) => {
            const color = p.color === 'red' ? '#ef4444' : p.color === 'amber' ? '#f59e0b' : '#22c55e';
            return (
              <div key={name} onClick={() => setDistrict(name)} style={{ cursor: 'pointer', padding: '0.85rem', background: district === name ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.04)', border: `1px solid ${district === name ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.1)'}`, borderRadius: '0.6rem', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8d0' }}>{name}</span>
                  <span style={{ fontSize: '0.75rem', color, fontWeight: 700 }}>{p.level}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.4rem' }}>{p.pest}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.4rem' }}>Crop: {p.crop}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.score * 100}%`, background: color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: '1.25rem', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>🛡️ GENERAL PEST MANAGEMENT TIPS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.75rem' }}>
          {[
            { title: 'Regular Scouting', tip: 'Inspect fields twice weekly, especially during 40-60 days after sowing.', icon: '🔍' },
            { title: 'Pheromone Traps', tip: 'Install 5 traps per acre at early season for bollworm monitoring.', icon: '🪤' },
            { title: 'Biological Control', tip: 'Release Trichogramma @ 1.5 lakh eggs/ha for lepidopteran pests.', icon: '🦗' },
            { title: 'Weather-based Timing', tip: 'Spray early morning or evening when winds are calm for best efficacy.', icon: '🌤️' },
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
