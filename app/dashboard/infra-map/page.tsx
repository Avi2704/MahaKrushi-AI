'use client';
import { useState } from 'react';
import { LABS, EQUIPMENT, COLD_STORAGE, DISTRICTS } from '@/lib/data';

const LAYERS = [
  { key: 'labs', label: 'Soil & Seed Labs', icon: '🧪', color: '#06b6d4' },
  { key: 'equipment', label: 'Equipment Rental', icon: '🚜', color: '#84cc16' },
  { key: 'storage', label: 'Cold Storage', icon: '❄️', color: '#3b82f6' },
  { key: 'districts', label: 'Districts', icon: '🗺️', color: '#22c55e' },
];

export default function InfraMapPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>(['labs', 'equipment', 'storage']);
  const [filterDist, setFilterDist] = useState('');

  const toggle = (key: string) =>
    setActiveLayers(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const labsShown = activeLayers.includes('labs') ? LABS.filter(l => !filterDist || l.district === filterDist) : [];
  const eqShown = activeLayers.includes('equipment') ? EQUIPMENT.filter(e => !filterDist || e.district === filterDist) : [];
  const stShown = activeLayers.includes('storage') ? COLD_STORAGE.filter(s => !filterDist || s.district === filterDist) : [];

  const allDistricts = [...new Set([...LABS.map(l => l.district), ...EQUIPMENT.map(e => e.district), ...COLD_STORAGE.map(s => s.district)])];

  return (
    <div style={{ maxWidth: '1300px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>🗺️ Integrated Agriculture Infrastructure Map</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Toggle layers to view labs, equipment rentals, and cold storage across Maharashtra</p>
      </div>

      {/* Layer Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        {LAYERS.map(layer => (
          <button key={layer.key} onClick={() => toggle(layer.key)} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem',
            background: activeLayers.includes(layer.key) ? `${layer.color}20` : 'rgba(34,197,94,0.04)',
            border: `1px solid ${activeLayers.includes(layer.key) ? layer.color : 'rgba(34,197,94,0.15)'}`,
            borderRadius: '9999px', color: activeLayers.includes(layer.key) ? layer.color : '#6b7280',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: activeLayers.includes(layer.key) ? 600 : 400, transition: 'all 0.2s',
          }}>
            {layer.icon} {layer.label}
          </button>
        ))}
        <select value={filterDist} onChange={e => setFilterDist(e.target.value)} style={{ marginLeft: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <option value="">All Districts</option>
          {allDistricts.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Labs Shown', value: labsShown.length, icon: '🧪', color: '#06b6d4' },
          { label: 'Equipment', value: eqShown.length, icon: '🚜', color: '#84cc16' },
          { label: 'Cold Storage', value: stShown.length, icon: '❄️', color: '#3b82f6' },
          { label: 'Total Points', value: labsShown.length + eqShown.length + stShown.length, icon: '📍', color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="card" style={{ height: '420px', padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
        <div style={{ fontWeight: 700, color: '#e2e8d0', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Maharashtra Infrastructure Map</div>
        <div style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', maxWidth: '400px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Interactive map with {labsShown.length} labs, {eqShown.length} equipment listings, and {stShown.length} cold storage facilities. Mapbox integration available in production deployment.
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {LAYERS.filter(l => activeLayers.includes(l.key)).map(layer => (
            <div key={layer.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: `${layer.color}10`, border: `1px solid ${layer.color}30`, borderRadius: '0.4rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: layer.color }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: layer.color }}></div>
              {layer.icon} {layer.label}
            </div>
          ))}
        </div>

        {/* Maharashtra outline SVG approximation */}
        <div style={{ position: 'absolute', right: '1rem', top: '1rem', fontSize: '0.7rem', color: '#4b5563' }}>
          Maharashtra – 36 Districts
        </div>
      </div>

      {/* List Views */}
      {labsShown.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#06b6d4', marginBottom: '0.75rem' }}>🧪 SOIL & SEED LABS ({labsShown.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '0.6rem' }}>
            {labsShown.map(l => (
              <div key={l.id} style={{ padding: '0.65rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 600, color: '#e2e8d0', marginBottom: '0.2rem' }}>{l.name}</div>
                <div style={{ color: '#6b7280' }}>📍 {l.city}, {l.district} • {l.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {eqShown.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#84cc16', marginBottom: '0.75rem' }}>🚜 EQUIPMENT RENTALS ({eqShown.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '0.6rem' }}>
            {eqShown.map(e => (
              <div key={e.id} style={{ padding: '0.65rem', background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.15)', borderRadius: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 600, color: '#e2e8d0', marginBottom: '0.2rem' }}>{e.name}</div>
                <div style={{ color: '#6b7280' }}>📍 {e.village}, {e.district} • ₹{e.priceDay}/day</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stShown.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.75rem' }}>❄️ COLD STORAGE ({stShown.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '0.6rem' }}>
            {stShown.map(s => (
              <div key={s.id} style={{ padding: '0.65rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 600, color: '#e2e8d0', marginBottom: '0.2rem' }}>{s.name}</div>
                <div style={{ color: '#6b7280' }}>📍 {s.city}, {s.district} • {s.capacityTons.toLocaleString()} tons</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
