'use client';
import { useState, useEffect } from 'react';
import { weatherApi } from '@/lib/api';

const DISTRICTS = [
  'Nashik','Pune','Nagpur','Aurangabad','Solapur','Kolhapur','Amravati',
  'Nanded','Jalgaon','Ahmednagar','Satara','Sangli','Latur','Yavatmal'
];

export default function WeatherPage() {
  const [weather, setWeather] = useState<any>(null);
  const [district, setDistrict] = useState('Nashik');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => { loadWeather(); }, [district]);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await weatherApi.getDistrict(district);
      setWeather(data);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const conditionBg = (code: number) => {
    if (code === 0 || code === 1) return 'linear-gradient(135deg,#1e3a5f,#2d6a4f)';
    if (code >= 51 && code <= 67) return 'linear-gradient(135deg,#1a2744,#0d3b6e)';
    if (code >= 95) return 'linear-gradient(135deg,#1a1a2e,#16213e)';
    return 'linear-gradient(135deg,#1e3349,#2d5016)';
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>🌦️ Live Weather Intelligence</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>Powered by Open-Meteo (free) • Last updated: {lastUpdated}</p>
        </div>
        <select value={district} onChange={e => setDistrict(e.target.value)} className="input-field" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌦️</div>
          Fetching live weather from Open-Meteo...
        </div>
      ) : weather ? (
        <>
          {/* Main weather hero */}
          <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem', background: conditionBg(weather.weather_code) }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>📍 {district}, Maharashtra</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white' }}>{weather.temperature}°C</span>
                    <span style={{ fontSize: '3.5rem' }}>{weather.icon}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginTop: '0.4rem' }}>{weather.condition}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.2rem' }}>Feels like {weather.feels_like}°C</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    ['💧 Humidity', `${weather.humidity}%`],
                    ['🌧️ Rainfall', `${weather.rainfall_mm}mm`],
                    ['💨 Wind', `${weather.wind_speed_kmh} km/h`],
                    ['🔆 UV Index', `${weather.uv_index}`],
                    ['☁️ Cloud Cover', `${weather.cloud_cover}%`],
                    ['📊 Pressure', `${weather.pressure} hPa`],
                  ].map(([label, val]) => (
                    <div key={label as string} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Alerts */}
            {weather.alerts?.length > 0 && (
              <div style={{ padding: '0.75rem 2rem', background: 'rgba(239,68,68,0.25)', borderTop: '1px solid rgba(239,68,68,0.3)' }}>
                {weather.alerts.map((a: any, i: number) => (
                  <div key={i} style={{ color: '#fca5a5', fontSize: '0.85rem', marginBottom: i < weather.alerts.length-1 ? '0.4rem' : 0 }}>
                    🚨 <strong>{a.type}</strong> ({a.severity}): {a.msg}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7-Day Forecast */}
          {weather.forecast?.length > 0 && (
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>📅 7-DAY FORECAST</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {weather.forecast.slice(0,7).map((f: any, i: number) => (
                  <div key={i} style={{ textAlign: 'center', padding: '0.75rem 0.4rem', background: 'rgba(34,197,94,0.04)', borderRadius: '0.6rem', border: '1px solid rgba(34,197,94,0.1)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>{f.day}</div>
                    <div style={{ fontSize: '1.4rem', margin: '0.4rem 0' }}>{f.icon}</div>
                    <div style={{ fontSize: '0.9rem', color: '#f0fdf4', fontWeight: 700 }}>{f.high}°</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{f.low}°</div>
                    {f.rain > 0 && <div style={{ fontSize: '0.65rem', color: '#60a5fa', marginTop: '0.2rem' }}>💧{f.rain}mm</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hourly */}
          {weather.hourly?.length > 0 && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>⏰ HOURLY FORECAST (24h)</h3>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {weather.hourly.slice(0,24).map((h: any, i: number) => (
                  <div key={i} style={{ minWidth: '54px', textAlign: 'center', padding: '0.5rem 0.3rem', background: 'rgba(34,197,94,0.04)', borderRadius: '0.5rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>{h.hour}</div>
                    <div style={{ fontSize: '1.1rem', margin: '0.2rem 0' }}>{h.icon}</div>
                    <div style={{ fontSize: '0.78rem', color: '#f0fdf4', fontWeight: 600 }}>{h.temp}°</div>
                    <div style={{ fontSize: '0.62rem', color: '#60a5fa' }}>{h.rain_prob}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Select a district to view weather</div>
      )}

      {weather && (
        <button onClick={loadWeather} style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.5rem', color: '#22c55e', cursor: 'pointer', fontSize: '0.82rem' }}>
          🔄 Refresh Live Data
        </button>
      )}
    </div>
  );
}
