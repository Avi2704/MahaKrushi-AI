'use client';
import { useState, useEffect } from 'react';
import { equipmentApi, geoApi, getUser } from '@/lib/api';
import Link from 'next/link';

const CATEGORIES = ['Tractor', 'Harvester', 'Rotavator', 'Cultivator', 'Seed Drill', 'Drone Sprayer', 'Power Tiller', 'Pump', 'Thresher', 'Fertilizer Spreader', 'Sprayer', 'Plough'];

export default function OwnerPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    equipment_name: '', category: 'Tractor', brand: '', model: '',
    description: '', price_per_day: '', price_per_hour: '',
    district_id: '', contact_number: '', latitude: '', longitude: '',
    available_from: '', available_to: '',
  });

  useEffect(() => {
    const u = getUser();
    setUser(u);
    loadListings();
    geoApi.districts().then(d => setDistricts(d.data || [])).catch(() => {});
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await equipmentApi.ownerListings();
      setListings(data.data || []);
    } catch {}
    setLoading(false);
  };

  const upd = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreate = async () => {
    setSaving(true); setMsg('');
    try {
      const payload: any = { ...form };
      if (form.district_id) payload.district_id = parseInt(form.district_id);
      if (form.price_per_day) payload.price_per_day = parseFloat(form.price_per_day);
      if (form.price_per_hour) payload.price_per_hour = parseFloat(form.price_per_hour);
      if (form.latitude) payload.latitude = parseFloat(form.latitude);
      if (form.longitude) payload.longitude = parseFloat(form.longitude);
      
      await equipmentApi.create(payload);
      setMsg('✅ Equipment listed successfully!');
      setShowForm(false);
      setForm({ equipment_name: '', category: 'Tractor', brand: '', model: '', description: '', price_per_day: '', price_per_hour: '', district_id: '', contact_number: '', latitude: '', longitude: '', available_from: '', available_to: '' });
      await loadListings();
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
    setSaving(false);
  };

  const handleDeactivate = async (id: number) => {
    await equipmentApi.deactivate(id);
    await loadListings();
  };

  if (!user) return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: '#f0fdf4' }}>Please login as Equipment Owner</h2>
      <Link href="/auth" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Login / Register</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>🚜 Equipment Owner Portal</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Manage your equipment listings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ List New Equipment'}
        </button>
      </div>

      {msg && <div style={{ padding: '0.75rem 1rem', background: msg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '0.5rem', marginBottom: '1rem', color: msg.startsWith('✅') ? '#22c55e' : '#ef4444' }}>{msg}</div>}

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 700, marginBottom: '1rem' }}>📋 NEW EQUIPMENT LISTING</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[['equipment_name', 'Equipment Name *', 'text', 'e.g. John Deere 5310 Tractor'],
              ['brand', 'Brand', 'text', 'e.g. John Deere'],
              ['model', 'Model', 'text', 'e.g. 5310'],
              ['price_per_day', 'Price Per Day (₹) *', 'number', '2500'],
              ['price_per_hour', 'Price Per Hour (₹)', 'number', '350'],
              ['contact_number', 'Contact Number', 'tel', '9823000000'],
              ['latitude', 'Latitude (for map)', 'number', '19.997'],
              ['longitude', 'Longitude (for map)', 'number', '73.789'],
              ['available_from', 'Available From', 'date', ''],
              ['available_to', 'Available To', 'date', ''],
            ].map(([k, label, type, ph]) => (
              <div key={k}>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>{label}</label>
                <input type={type} value={form[k as keyof typeof form]} onChange={upd(k)} placeholder={ph} className="input-field" style={{ padding: '0.5rem' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Category *</label>
              <select value={form.category} onChange={upd('category')} className="input-field" style={{ padding: '0.5rem' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>District</label>
              <select value={form.district_id} onChange={upd('district_id')} className="input-field" style={{ padding: '0.5rem' }}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Description</label>
              <textarea value={form.description} onChange={upd('description') as any} rows={2} className="input-field" style={{ resize: 'none', padding: '0.5rem' }} placeholder="Equipment details, condition, features..." />
            </div>
          </div>
          <button onClick={handleCreate} disabled={saving || !form.equipment_name || !form.price_per_day} className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            {saving ? '⏳ Listing...' : '🚜 Submit Listing'}
          </button>
        </div>
      )}

      {/* Listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚜</div>
            <div style={{ color: '#e2e8d0', fontWeight: 600 }}>No equipment listed yet</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.4rem' }}>Click "+ List New Equipment" to get started</div>
          </div>
        ) : listings.map(eq => (
          <div key={eq.id} className="card" style={{ padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#f0fdf4', fontSize: '0.95rem' }}>{eq.equipment_name}</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                {eq.category} • {eq.brand} {eq.model} • ₹{eq.price_per_day}/day
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: eq.availability_status === 'available' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', color: eq.availability_status === 'available' ? '#22c55e' : '#9ca3af' }}>
                {eq.availability_status}
              </span>
              <button onClick={() => handleDeactivate(eq.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.4rem', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem' }}>Deactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
