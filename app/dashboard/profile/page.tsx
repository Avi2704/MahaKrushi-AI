'use client';
import { useState, useEffect } from 'react';
import { farmerApi, geoApi, getUser } from '@/lib/api';

const SOIL_TYPES = ['Black Cotton', 'Red Laterite', 'Alluvial', 'Sandy Loam', 'Clay', 'Loamy', 'Sandy'];
const IRRIGATION_TYPES = ['Drip', 'Sprinkler', 'Flood', 'Rainfed', 'Canal', 'Borewell', 'Well'];
const CROPS = ['Onion', 'Cotton', 'Soybean', 'Wheat', 'Sugarcane', 'Grapes', 'Pomegranate', 'Tomato', 'Banana', 'Tur', 'Maize', 'Jowar', 'Rice', 'Gram', 'Chilli', 'Orange'];
const LANGUAGES = [{ value: 'mr', label: 'मराठी (Marathi)' }, { value: 'hi', label: 'हिंदी (Hindi)' }, { value: 'en', label: 'English' }];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [talukas, setTalukas] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    gender: '', date_of_birth: '', district_id: '', taluka_id: '',
    full_address: '', latitude: '', longitude: '',
    farm_size_acres: '', soil_type: '', irrigation_type: '',
    primary_crop: '', secondary_crop: '', preferred_language: 'mr',
  });

  useEffect(() => {
    loadProfile();
    loadDistricts();
  }, []);

  const loadProfile = async () => {
    const u = getUser();
    setUser(u);
    if (!u) { setLoading(false); return; }
    try {
      const data = await farmerApi.getProfile();
      setProfile(data.profile);
      if (data.profile?.has_profile) {
        setForm(f => ({ ...f, ...Object.fromEntries(Object.entries(data.profile).map(([k, v]) => [k, v != null ? String(v) : ''])) }));
        if (data.profile.district_id) loadTalukas(data.profile.district_id);
      }
      if (!data.profile?.has_profile) setEditMode(true);
    } catch {}
    setLoading(false);
  };

  const loadDistricts = async () => {
    try {
      const data = await geoApi.districts();
      setDistricts(data.data || []);
    } catch {}
  };

  const loadTalukas = async (distId: number) => {
    try {
      const data = await geoApi.talukas(distId);
      setTalukas(data.data || []);
    } catch {}
  };

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const payload: any = { ...form };
      if (form.district_id) payload.district_id = parseInt(form.district_id);
      if (form.taluka_id) payload.taluka_id = parseInt(form.taluka_id);
      if (form.farm_size_acres) payload.farm_size_acres = parseFloat(form.farm_size_acres);
      if (form.latitude) payload.latitude = parseFloat(form.latitude);
      if (form.longitude) payload.longitude = parseFloat(form.longitude);
      
      await farmerApi.createProfile(payload);
      setMsg('✅ Profile saved successfully!');
      setEditMode(false);
      await loadProfile();
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
    setSaving(false);
  };

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (k === 'district_id' && e.target.value) loadTalukas(parseInt(e.target.value));
  };

  if (loading) return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

  if (!user) return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
      <h2 style={{ color: '#f0fdf4', marginBottom: '0.5rem' }}>Please Login First</h2>
      <a href="/auth" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Login / Register</a>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>👨‍🌾 My Profile</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Manage your farm & personal details / आपली शेत माहिती</p>
        </div>
        {!editMode && <button onClick={() => setEditMode(true)} className="btn-primary">✏️ Edit Profile</button>}
      </div>

      {msg && <div style={{ padding: '0.75rem 1rem', background: msg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '0.5rem', marginBottom: '1rem', color: msg.startsWith('✅') ? '#22c55e' : '#ef4444' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.25rem' }}>
        {/* Avatar */}
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 0.75rem' }}>👨‍🌾</div>
          <div style={{ fontWeight: 700, color: '#f0fdf4', fontSize: '0.95rem' }}>{user?.full_name}</div>
          <div style={{ color: '#9ca3af', fontSize: '0.78rem', margin: '0.25rem 0' }}>{user?.mobile}</div>
          <div style={{ display: 'inline-block', background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
        </div>

        {/* Form / View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Personal */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, marginBottom: '0.85rem' }}>👤 PERSONAL DETAILS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Gender</label>
                {editMode ? (
                  <select value={form.gender} onChange={upd('gender')} className="input-field" style={{ padding: '0.5rem' }}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                ) : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{profile?.gender || '—'}</div>}
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Date of Birth</label>
                {editMode ? <input type="date" value={form.date_of_birth} onChange={upd('date_of_birth')} className="input-field" style={{ padding: '0.5rem' }} /> : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{profile?.date_of_birth || '—'}</div>}
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Preferred Language</label>
                {editMode ? (
                  <select value={form.preferred_language} onChange={upd('preferred_language')} className="input-field" style={{ padding: '0.5rem' }}>
                    {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                ) : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{LANGUAGES.find(l => l.value === profile?.preferred_language)?.label || 'Marathi'}</div>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, marginBottom: '0.85rem' }}>📍 LOCATION</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>District / जिल्हा</label>
                {editMode ? (
                  <select value={form.district_id} onChange={upd('district_id')} className="input-field" style={{ padding: '0.5rem' }}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                ) : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{profile?.district_name || '—'}</div>}
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Taluka / तालुका</label>
                {editMode ? (
                  <select value={form.taluka_id} onChange={upd('taluka_id')} className="input-field" style={{ padding: '0.5rem' }}>
                    <option value="">Select Taluka</option>
                    {talukas.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                ) : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{profile?.taluka_id || '—'}</div>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Full Address</label>
                {editMode ? <textarea value={form.full_address} onChange={upd('full_address')} rows={2} className="input-field" style={{ resize: 'none', padding: '0.5rem' }} placeholder="Village, Taluka, District" /> : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{profile?.full_address || '—'}</div>}
              </div>
            </div>
          </div>

          {/* Farm */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, marginBottom: '0.85rem' }}>🌾 FARM DETAILS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                ['farm_size_acres', 'Farm Size (Acres)', 'number', 'e.g. 5.5'],
                ['soil_type', 'Soil Type', 'select-soil', ''],
                ['irrigation_type', 'Irrigation Type', 'select-irrigation', ''],
                ['primary_crop', 'Primary Crop / मुख्य पीक', 'select-crop', ''],
                ['secondary_crop', 'Secondary Crop / दुय्यम पीक', 'select-crop', ''],
              ].map(([key, label, type, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>{label}</label>
                  {editMode ? (
                    type === 'select-soil' ? (
                      <select value={form[key as keyof typeof form]} onChange={upd(key)} className="input-field" style={{ padding: '0.5rem' }}>
                        <option value="">Select</option>{SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    ) : type === 'select-irrigation' ? (
                      <select value={form[key as keyof typeof form]} onChange={upd(key)} className="input-field" style={{ padding: '0.5rem' }}>
                        <option value="">Select</option>{IRRIGATION_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    ) : type === 'select-crop' ? (
                      <select value={form[key as keyof typeof form]} onChange={upd(key)} className="input-field" style={{ padding: '0.5rem' }}>
                        <option value="">Select</option>{CROPS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={form[key as keyof typeof form]} onChange={upd(key)} placeholder={ph} className="input-field" style={{ padding: '0.5rem' }} />
                    )
                  ) : <div style={{ color: '#e2e8d0', fontWeight: 500 }}>{profile?.[key as any] || '—'}</div>}
                </div>
              ))}
            </div>
          </div>

          {editMode && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? '⏳ Saving...' : '💾 Save Profile'}
              </button>
              <button onClick={() => { setEditMode(false); setMsg(''); }} style={{ padding: '0.75rem 1.25rem', background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.3)', borderRadius: '0.5rem', color: '#9ca3af', cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
