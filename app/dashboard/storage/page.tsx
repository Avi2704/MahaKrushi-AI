'use client';
import { useState, useEffect } from 'react';
import { storageApi } from '@/lib/api';

const STORAGE_TYPES = ['All', 'Cold Storage', 'Fruit Storage', 'Grain Warehouse', 'Onion Storage'];
const CROPS_LIST = ['All', 'Onion', 'Grapes', 'Banana', 'Orange', 'Pomegranate', 'Tomato', 'Wheat', 'Soybean', 'Cotton', 'Strawberry'];

export default function StoragePage() {
  const [storages, setStorages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [storageType, setStorageType] = useState('All');
  const [cropFilter, setCropFilter] = useState('All');
  const [nearestLoading, setNearestLoading] = useState(false);
  const [view, setView] = useState<'all' | 'nearest'>('all');

  useEffect(() => { loadStorage(); }, [storageType, cropFilter]);

  const loadStorage = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (storageType !== 'All') params.storage_type = storageType;
      if (cropFilter !== 'All') params.crop = cropFilter;
      const data = await storageApi.list(params);
      setStorages(data.data || []);
    } catch {}
    setLoading(false);
  };

  const findNearest = async () => {
    setNearestLoading(true);
    const doFetch = async (lat: number, lon: number) => {
      const data = await storageApi.nearest(lat, lon, cropFilter !== 'All' ? cropFilter : undefined, 200);
      setStorages(data.data || []);
      setView('nearest');
      setNearestLoading(false);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => doFetch(p.coords.latitude, p.coords.longitude),
        () => doFetch(19.9975, 73.7898)
      );
    } else doFetch(19.9975, 73.7898);
  };

  const typeColor = (t: string) => {
    if (t?.includes('Cold') || t?.includes('Fruit')) return { bg: 'rgba(14,165,233,0.1)', c: '#0ea5e9' };
    if (t?.includes('Grain') || t?.includes('Warehouse')) return { bg: 'rgba(245,158,11,0.1)', c: '#f59e0b' };
    if (t?.includes('Onion')) return { bg: 'rgba(168,85,247,0.1)', c: '#a855f7' };
    return { bg: 'rgba(34,197,94,0.1)', c: '#22c55e' };
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>❄️ Cold Storage Directory</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Maharashtra state storage facilities • {storages.length} found</p>
        </div>
        <button onClick={findNearest} disabled={nearestLoading} style={{ padding: '0.5rem 1rem', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '0.5rem', color: '#0ea5e9', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
          {nearestLoading ? '⏳' : '📍 Find Nearest Storage'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {STORAGE_TYPES.map(t => (
          <button key={t} onClick={() => setStorageType(t)} style={{ padding: '0.35rem 0.65rem', borderRadius: '9999px', border: `1px solid ${storageType === t ? 'rgba(14,165,233,0.5)' : 'rgba(14,165,233,0.15)'}`, background: storageType === t ? 'rgba(14,165,233,0.1)' : 'transparent', color: storageType === t ? '#0ea5e9' : '#6b7280', cursor: 'pointer', fontSize: '0.75rem', fontWeight: storageType === t ? 700 : 400 }}>{t}</button>
        ))}
        <select value={cropFilter} onChange={e => setCropFilter(e.target.value)} className="input-field" style={{ padding: '0.3rem 0.6rem', width: 'auto', fontSize: '0.78rem' }}>
          {CROPS_LIST.map(c => <option key={c}>{c}</option>)}
        </select>
        {view === 'nearest' && <button onClick={() => { setView('all'); loadStorage(); }} style={{ padding: '0.35rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22c55e', cursor: 'pointer', fontSize: '0.75rem' }}>All Storage</button>}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading storage directory...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '0.85rem' }}>
          {storages.map((s: any) => {
            const { bg, c } = typeColor(s.storage_type);
            const utilPct = Math.round((1 - s.available_capacity / s.capacity_tons) * 100) || 0;
            return (
              <div key={s.id} className="card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f0fdf4', fontSize: '0.9rem', lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.2rem' }}>{s.city}</div>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, background: bg, color: c, flexShrink: 0 }}>{s.storage_type}</span>
                </div>

                {/* Capacity bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.3rem' }}>
                    <span>Capacity: {s.capacity_tons?.toLocaleString()} MT</span>
                    <span style={{ color: utilPct > 80 ? '#ef4444' : utilPct > 60 ? '#f59e0b' : '#22c55e' }}>{utilPct}% used</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(34,197,94,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${utilPct}%`, background: utilPct > 80 ? '#ef4444' : utilPct > 60 ? '#f59e0b' : '#22c55e', borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#22c55e', marginTop: '0.2rem' }}>Available: {s.available_capacity?.toLocaleString()} MT</div>
                </div>

                {s.supported_crops?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {s.supported_crops.map((c: string) => <span key={c} style={{ padding: '0.1rem 0.4rem', background: 'rgba(34,197,94,0.06)', borderRadius: '9999px', fontSize: '0.63rem', color: '#9ca3af' }}>{c}</span>)}
                  </div>
                )}

                <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {s.temp_range && <span>🌡️ {s.temp_range}</span>}
                  {s.phone && <span>📞 {s.phone}</span>}
                  {s.owner_name && <span>👤 {s.owner_name}</span>}
                  {s.distance_km != null && <span style={{ color: '#0ea5e9' }}>📍 {s.distance_km} km away</span>}
                </div>

                {s.google_maps_url && (
                  <a href={s.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '0.4rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.4rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}>🗺️ Get Directions</a>
                )}
              </div>
            );
          })}
          {storages.length === 0 && !loading && (
            <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No storage facilities found with these filters</div>
          )}
        </div>
      )}
    </div>
  );
}
