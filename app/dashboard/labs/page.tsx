'use client';
import { useState, useEffect } from 'react';
import { labsApi } from '@/lib/api';

const LAB_TYPES = ['All', 'Soil', 'Seed', 'Both'];
const OWNERSHIPS = ['All', 'Government', 'Private', 'University'];

export default function LabsPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [labType, setLabType] = useState('All');
  const [ownership, setOwnership] = useState('All');
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearestLabs, setNearestLabs] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'all' | 'nearest'>('all');

  useEffect(() => { loadLabs(); }, [labType, ownership, search]);

  const loadLabs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (labType !== 'All') params.lab_type = labType;
      if (ownership !== 'All') params.ownership = ownership;
      if (search) params.search = search;
      const data = await labsApi.list(params);
      setLabs(data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const findNearest = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const data = await labsApi.nearest(pos.coords.latitude, pos.coords.longitude, labType !== 'All' ? labType : undefined, 150);
        setNearestLabs(data.data || []);
        setActiveView('nearest');
        setLocationLoading(false);
      }, () => {
        // Fallback: use Nashik coords
        labsApi.nearest(19.9975, 73.7898, undefined, 100).then(d => {
          setNearestLabs(d.data || []);
          setActiveView('nearest');
        });
        setLocationLoading(false);
      });
    } catch { setLocationLoading(false); }
  };

  const displayLabs = activeView === 'nearest' ? nearestLabs : labs;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>🧪 Soil & Seed Testing Labs</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Maharashtra state-wide lab directory • {labs.length} labs found</p>
        </div>
        <button onClick={findNearest} disabled={locationLoading} style={{ padding: '0.5rem 1rem', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '0.5rem', color: '#a855f7', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
          {locationLoading ? '⏳ Finding...' : '📍 Find Nearest Labs'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search labs..." className="input-field" style={{ padding: '0.45rem 0.75rem', flex: '1', minWidth: '150px' }} />
        {LAB_TYPES.map(t => (
          <button key={t} onClick={() => setLabType(t)} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: `1px solid ${labType === t ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.15)'}`, background: labType === t ? 'rgba(34,197,94,0.1)' : 'transparent', color: labType === t ? '#22c55e' : '#6b7280', cursor: 'pointer', fontSize: '0.78rem', fontWeight: labType === t ? 700 : 400 }}>{t}</button>
        ))}
        {['Gov', 'Private', 'Uni'].map((o, i) => (
          <button key={o} onClick={() => setOwnership(['All', 'Government', 'Private', 'University'][i+1])} style={{ padding: '0.4rem 0.65rem', borderRadius: '9999px', border: `1px solid ${ownership === ['Government', 'Private', 'University'][i] ? 'rgba(168,85,247,0.5)' : 'rgba(168,85,247,0.15)'}`, background: ownership === ['Government', 'Private', 'University'][i] ? 'rgba(168,85,247,0.1)' : 'transparent', color: ownership === ['Government', 'Private', 'University'][i] ? '#a855f7' : '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}>{o}</button>
        ))}
        {activeView === 'nearest' && <button onClick={() => setActiveView('all')} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22c55e', cursor: 'pointer', fontSize: '0.78rem' }}>All Labs</button>}
      </div>

      {/* Lab Cards */}
      {loading ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading labs directory...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {displayLabs.map((lab: any) => (
            <div key={lab.id} className="card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f0fdf4', fontSize: '0.9rem', lineHeight: 1.3 }}>{lab.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.2rem' }}>{lab.city}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700, background: lab.lab_type === 'Soil' ? 'rgba(245,158,11,0.1)' : lab.lab_type === 'Seed' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', color: lab.lab_type === 'Soil' ? '#f59e0b' : lab.lab_type === 'Seed' ? '#22c55e' : '#60a5fa' }}>{lab.lab_type}</span>
                  {lab.is_verified && <span style={{ padding: '0.15rem 0.4rem', borderRadius: '9999px', fontSize: '0.63rem', background: 'rgba(34,197,94,0.06)', color: '#22c55e', textAlign: 'center' }}>✅ Verified</span>}
                </div>
              </div>

              {lab.services?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {lab.services.slice(0,3).map((s: string) => (
                    <span key={s} style={{ padding: '0.15rem 0.45rem', background: 'rgba(34,197,94,0.06)', borderRadius: '9999px', fontSize: '0.65rem', color: '#9ca3af' }}>{s}</span>
                  ))}
                  {lab.services.length > 3 && <span style={{ fontSize: '0.65rem', color: '#4b5563' }}>+{lab.services.length - 3} more</span>}
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {lab.phone && <span>📞 {lab.phone}</span>}
                {lab.operating_hours && <span>🕐 {lab.operating_hours}</span>}
                {lab.certification && <span>🏆 {lab.certification}</span>}
                {lab.distance_km != null && <span style={{ color: '#a855f7' }}>📍 {lab.distance_km} km away</span>}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {lab.phone && (
                  <a href={`tel:${lab.phone}`} style={{ flex: 1, padding: '0.4rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.4rem', color: '#22c55e', textDecoration: 'none', fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}>📞 Call</a>
                )}
                {lab.google_maps_url && (
                  <a href={lab.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '0.4rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.4rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}>🗺️ Directions</a>
                )}
              </div>
            </div>
          ))}
          {displayLabs.length === 0 && !loading && (
            <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              {activeView === 'nearest' ? 'Click "Find Nearest Labs" to search by your location' : 'No labs found with current filters'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
