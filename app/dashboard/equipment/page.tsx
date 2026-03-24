'use client';
import { useState, useEffect } from 'react';
import { equipmentApi } from '@/lib/api';
import Link from 'next/link';

const CATEGORIES = ['All', 'Tractor', 'Harvester', 'Rotavator', 'Cultivator', 'Seed Drill', 'Drone Sprayer', 'Power Tiller', 'Pump', 'Thresher', 'Sprayer'];

export default function EquipmentBrowsePage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [nearestLoading, setNearestLoading] = useState(false);
  const [view, setView] = useState<'all' | 'nearest'>('all');
  const [inquiryModal, setInquiryModal] = useState<any>(null);
  const [inquiryMsg, setInquiryMsg] = useState('');

  useEffect(() => { loadEquipment(); }, [category, search, maxPrice]);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      if (maxPrice) params.max_price = parseFloat(maxPrice);
      const data = await equipmentApi.list(params);
      setEquipment(data.data || []);
    } catch {}
    setLoading(false);
  };

  const findNearest = async () => {
    setNearestLoading(true);
    const doFetch = async (lat: number, lon: number) => {
      const data = await equipmentApi.nearby(lat, lon, category !== 'All' ? category : undefined, 10);
      setEquipment(data.data || []);
      setView('nearest');
      setNearestLoading(false);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => doFetch(p.coords.latitude, p.coords.longitude), () => doFetch(19.9975, 73.7898));
    } else doFetch(19.9975, 73.7898);
  };

  const sendInquiry = async () => {
    if (!inquiryModal) return;
    try {
      await equipmentApi.inquire(inquiryModal.id, {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        message: inquiryMsg
      });
      setInquiryModal(null);
      setInquiryMsg('');
      alert('✅ Inquiry sent to equipment owner!');
    } catch (e: any) {
      alert(e.message || 'Please login to send inquiry');
    }
  };

  const catColor = (c: string) => {
    const map: Record<string, [string, string]> = {
      'Tractor': ['rgba(34,197,94,0.08)', '#22c55e'],
      'Harvester': ['rgba(245,158,11,0.08)', '#f59e0b'],
      'Drone Sprayer': ['rgba(6,182,212,0.08)', '#06b6d4'],
      'Rotavator': ['rgba(168,85,247,0.08)', '#a855f7'],
    };
    return map[c] || ['rgba(107,114,128,0.08)', '#9ca3af'];
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>🚜 Equipment Rental Marketplace</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Browse and rent farm equipment across Maharashtra • {equipment.length} listings</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={findNearest} disabled={nearestLoading} style={{ padding: '0.5rem 0.85rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.5rem', color: '#22c55e', cursor: 'pointer', fontSize: '0.82rem' }}>
            {nearestLoading ? '⏳' : '📍 Near Me'}
          </button>
          <Link href="/owner" style={{ padding: '0.5rem 0.85rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.5rem', color: '#f59e0b', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
            + List Equipment
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search equipment..." className="input-field" style={{ padding: '0.42rem 0.75rem', flex: 1, minWidth: '140px' }} />
        <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" placeholder="Max ₹/day" className="input-field" style={{ padding: '0.42rem 0.75rem', width: '110px' }} />
        {view === 'nearest' && <button onClick={() => { setView('all'); loadEquipment(); }} style={{ padding: '0.35rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22c55e', cursor: 'pointer', fontSize: '0.75rem' }}>All</button>}
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {CATEGORIES.slice(0, 8).map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: '0.35rem 0.65rem', borderRadius: '9999px', border: `1px solid ${category === c ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.12)'}`, background: category === c ? 'rgba(34,197,94,0.12)' : 'transparent', color: category === c ? '#22c55e' : '#6b7280', cursor: 'pointer', fontSize: '0.75rem', fontWeight: category === c ? 700 : 400 }}>{c}</button>
        ))}
      </div>

      {/* Equipment Cards */}
      {loading ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading equipment listings...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {equipment.map((eq: any) => {
            const [bg, c] = catColor(eq.category);
            return (
              <div key={eq.id} className="card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#f0fdf4', fontSize: '0.9rem', lineHeight: 1.3 }}>{eq.equipment_name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.2rem' }}>{eq.brand} {eq.model}</div>
                  </div>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, background: bg, color: c, flexShrink: 0 }}>{eq.category}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'center', flex: 1, background: 'rgba(34,197,94,0.05)', borderRadius: '0.4rem', padding: '0.4rem' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#22c55e' }}>₹{eq.price_per_day?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.62rem', color: '#6b7280' }}>per day</div>
                  </div>
                  {eq.price_per_hour && (
                    <div style={{ textAlign: 'center', flex: 1, background: 'rgba(245,158,11,0.05)', borderRadius: '0.4rem', padding: '0.4rem' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b' }}>₹{eq.price_per_hour?.toLocaleString()}</div>
                      <div style={{ fontSize: '0.62rem', color: '#6b7280' }}>per hour</div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {eq.contact_number && <span>📞 {eq.contact_number}</span>}
                  {eq.distance_km != null && <span style={{ color: '#22c55e' }}>📍 {eq.distance_km} km away</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 600, background: eq.availability_status === 'available' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', color: eq.availability_status === 'available' ? '#22c55e' : '#9ca3af' }}>
                    {eq.availability_status === 'available' ? '✅ Available' : '❌ Busy'}
                  </span>
                  {eq.availability_status === 'available' && (
                    <button onClick={() => setInquiryModal(eq)} style={{ flex: 1, padding: '0.35rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.4rem', color: '#22c55e', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>📩 Inquire</button>
                  )}
                  {eq.google_maps_url && (
                    <a href={eq.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '0.35rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.4rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}>🗺️</a>
                  )}
                </div>
              </div>
            );
          })}
          {equipment.length === 0 && !loading && (
            <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No equipment found with these filters</div>
          )}
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#0d1a0e', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '1rem', padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ color: '#f0fdf4', fontWeight: 700, marginBottom: '0.25rem' }}>📩 Send Rental Inquiry</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '1rem' }}>For: {inquiryModal.equipment_name}</p>
            <textarea value={inquiryMsg} onChange={e => setInquiryMsg(e.target.value)} rows={3} placeholder="Message to owner (optional)..." className="input-field" style={{ width: '100%', resize: 'none', marginBottom: '0.75rem', padding: '0.6rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={sendInquiry} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Send Inquiry</button>
              <button onClick={() => setInquiryModal(null)} style={{ padding: '0.6rem 1rem', background: 'transparent', border: '1px solid rgba(107,114,128,0.3)', borderRadius: '0.5rem', color: '#9ca3af', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
