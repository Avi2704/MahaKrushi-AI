'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { weatherApi, mandiApi, farmerApi, notificationsApi, getUser } from '@/lib/api';

export default function DashboardPage() {
  const [weather, setWeather] = useState<any>(null);
  const [prices, setPrices] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('Nashik');
  const [primaryCrop, setPrimaryCrop] = useState('Onion');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const u = getUser();
    setUser(u);
    loadDashboard(u);
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => loadDashboard(u), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (u: any) => {
    setLoading(true);
    try {
      // Try personalized dashboard if logged in
      if (u) {
        try {
          const dash = await farmerApi.getDashboard();
          setWeather(dash.weather);
          setPrices(dash.mandi_prices || []);
          setDistrict(dash.district || 'Nashik');
          setPrimaryCrop(dash.primary_crop || 'Onion');
          
          const nc = await notificationsApi.unreadCount();
          setUnread(nc.unread_count || 0);
          setLastUpdated(new Date().toLocaleTimeString('en-IN'));
          setLoading(false);
          return;
        } catch {}
      }
      
      // Anonymous fallback
      const [wx, mp] = await Promise.all([
        weatherApi.getDistrict('Nashik'),
        mandiApi.getPrices({ limit: 8 }),
      ]);
      setWeather(wx);
      setPrices(mp.data || []);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) {
      console.error('Dashboard load error:', e);
    }
    setLoading(false);
  };

  const MODULES = [
    { href: '/dashboard/weather', icon: '🌦️', label: 'Weather Intelligence', color: '#3b82f6' },
    { href: '/dashboard/satellite', icon: '🛰️', label: 'Satellite Crop Health', color: '#8b5cf6' },
    { href: '/dashboard/disease', icon: '🔬', label: 'AI Disease Detection', color: '#ef4444' },
    { href: '/dashboard/mandi', icon: '📊', label: 'Mandi Prices', color: '#f59e0b' },
    { href: '/dashboard/advisory', icon: '🌱', label: 'Crop Advisory', color: '#22c55e' },
    { href: '/dashboard/pest', icon: '🐛', label: 'Pest Prediction', color: '#f97316' },
    { href: '/dashboard/assistant', icon: '🤖', label: 'AI Assistant', color: '#06b6d4' },
    { href: '/dashboard/labs', icon: '🧪', label: 'Lab Directory', color: '#a855f7' },
    { href: '/dashboard/equipment', icon: '🚜', label: 'Equipment Rental', color: '#22c55e' },
    { href: '/dashboard/storage', icon: '❄️', label: 'Cold Storage', color: '#0ea5e9' },
    { href: '/dashboard/infra-map', icon: '🗺️', label: 'Infra Map', color: '#16a34a' },
    { href: '/dashboard/calendar', icon: '📅', label: 'Crop Calendar', color: '#d97706' },
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>
            {user ? `🌾 नमस्कार, ${user.full_name?.split(' ')[0]}!` : '🌾 MahaKrushi AI Dashboard'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '0.2rem' }}>
            {district} • {primaryCrop} • Last updated: {lastUpdated || 'Loading...'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/dashboard/notifications" style={{ position: 'relative', padding: '0.5rem 0.85rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>
            🔔 {unread > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread}</span>}
          </Link>
          {!user ? (
            <Link href="/auth" className="btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Login / Register</Link>
          ) : (
            <Link href="/dashboard/profile" style={{ padding: '0.5rem 0.85rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.5rem', color: '#22c55e', textDecoration: 'none', fontSize: '0.85rem' }}>👨‍🌾 Profile</Link>
          )}
        </div>
      </div>

      {/* Live Weather + Mandi Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Live Weather Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>🌦️ LIVE WEATHER — {district.toUpperCase()}</div>
              {loading ? (
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Loading live weather...</div>
              ) : weather ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f0fdf4' }}>{weather.temperature}°C</span>
                    <span style={{ fontSize: '1.8rem' }}>{weather.icon || '🌤️'}</span>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.25rem' }}>{weather.condition}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.78rem', color: '#6b7280' }}>
                    <span>💧 {weather.humidity}%</span>
                    <span>🌧️ {weather.rainfall_mm}mm</span>
                    <span>💨 {weather.wind_speed_kmh}km/h</span>
                    <span>☀️ UV {weather.uv_index}</span>
                  </div>
                  {weather.alerts?.length > 0 && (
                    <div style={{ marginTop: '0.75rem', padding: '0.4rem 0.65rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.4rem', fontSize: '0.78rem', color: '#ef4444' }}>
                      🚨 {weather.alerts[0].type}: {weather.alerts[0].msg}
                    </div>
                  )}
                </>
              ) : <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>Weather unavailable</div>}
            </div>
          </div>
          <Link href="/dashboard/weather" style={{ display: 'block', marginTop: '1rem', fontSize: '0.75rem', color: '#22c55e', textDecoration: 'none' }}>View 7-day forecast →</Link>
        </div>

        {/* Live Mandi Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>📊 LIVE MANDI PRICES</div>
          {loading ? (
            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Loading mandi prices...</div>
          ) : prices.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {prices.slice(0, 4).map((p: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0.5rem', background: 'rgba(245,158,11,0.05)', borderRadius: '0.4rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#e2e8d0', fontSize: '0.85rem' }}>{p.crop}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.73rem', marginLeft: '0.4rem' }}>({p.mandi_name})</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>₹{p.modal_price}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>/qtl</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>No prices available</div>}
          <Link href="/dashboard/mandi" style={{ display: 'block', marginTop: '1rem', fontSize: '0.75rem', color: '#f59e0b', textDecoration: 'none' }}>See all mandi prices →</Link>
        </div>
      </div>

      {/* Module Grid */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em' }}>⚡ QUICK ACCESS MODULES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.9rem 0.5rem', background: `${m.color}08`, border: `1px solid ${m.color}20`, borderRadius: '0.65rem', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 500, textAlign: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = `${m.color}15`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${m.color}08`)}
            >
              <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 7-day Forecast Chips */}
      {weather?.forecast && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>📅 7-DAY FORECAST</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
            {weather.forecast.slice(0, 7).map((f: any, i: number) => (
              <div key={i} style={{ textAlign: 'center', padding: '0.5rem 0.3rem', background: 'rgba(34,197,94,0.04)', borderRadius: '0.4rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{f.day}</div>
                <div style={{ fontSize: '1.2rem', margin: '0.2rem 0' }}>{f.icon}</div>
                <div style={{ fontSize: '0.75rem', color: '#f0fdf4', fontWeight: 600 }}>{f.high}°</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{f.low}°</div>
                {f.rain > 0 && <div style={{ fontSize: '0.65rem', color: '#3b82f6' }}>{f.rain}mm</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
