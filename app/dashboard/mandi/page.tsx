'use client';
import { useState, useEffect } from 'react';
import { mandiApi } from '@/lib/api';

const CROPS = ['Onion','Cotton','Soybean','Tomato','Grapes','Pomegranate','Banana','Orange','Tur','Sugarcane','Wheat','Maize','Chilli','Jowar','Gram'];
const DISTRICTS = ['All','Nashik','Pune','Nagpur','Aurangabad','Solapur','Kolhapur','Amravati','Nanded','Jalgaon','Latur','Sangli','Satara','Yavatmal'];

export default function MandiPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [bestMandi, setBestMandi] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [view, setView] = useState<'all' | 'crop'>('all');

  useEffect(() => { loadPrices(); }, [selectedCrop, selectedDistrict]);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const [pData, bData, tData] = await Promise.all([
        mandiApi.getPrices({ crop: view === 'crop' ? selectedCrop : undefined, district: selectedDistrict !== 'All' ? selectedDistrict : undefined, limit: 20 }),
        mandiApi.getBestMandi(selectedCrop, selectedDistrict !== 'All' ? selectedDistrict : undefined),
        mandiApi.getTrend(selectedCrop, 7),
      ]);
      setPrices(pData.data || []);
      setBestMandi(bData.best_mandi || null);
      setTrend(tData.trend || []);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const trendIcon = (trend: string) => trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  const trendColor = (trend: string) => trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#f59e0b';

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>📊 Live Mandi Price Intelligence</h1>
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>data.gov.in APMC prices • Last: {lastUpdated || '...'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)} className="input-field" style={{ padding: '0.45rem 0.75rem', width: 'auto' }}>
            {CROPS.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="input-field" style={{ padding: '0.45rem 0.75rem', width: 'auto' }}>
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <button onClick={loadPrices} style={{ padding: '0.45rem 0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.4rem', color: '#22c55e', cursor: 'pointer', fontSize: '0.82rem' }}>🔄</button>
        </div>
      </div>

      {/* Best Mandi Banner */}
      {bestMandi && (
        <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.1),rgba(245,158,11,0.08))', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700, marginBottom: '0.2rem' }}>🏆 BEST MANDI FOR {selectedCrop.toUpperCase()}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0fdf4' }}>{bestMandi.mandi_name}, {bestMandi.district_name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Modal Price</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b' }}>₹{bestMandi.modal_price}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>per Quintal</div>
          </div>
        </div>
      )}

      {/* 7-day Price Trend (visual bar) */}
      {trend.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.85rem', letterSpacing: '0.05em' }}>📈 7-DAY PRICE TREND — {selectedCrop}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '80px' }}>
            {trend.map((t: any, i: number) => {
              const prices = trend.map((x: any) => x.modal);
              const maxP = Math.max(...prices);
              const minP = Math.min(...prices);
              const height = maxP === minP ? 50 : ((t.modal - minP) / (maxP - minP)) * 70 + 10;
              const isLast = i === trend.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                  <div style={{ fontSize: '0.6rem', color: isLast ? '#f59e0b' : '#6b7280', fontWeight: isLast ? 700 : 400 }}>₹{t.modal}</div>
                  <div style={{ width: '100%', height: `${height}px`, background: isLast ? '#f59e0b' : 'rgba(245,158,11,0.4)', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
                  <div style={{ fontSize: '0.55rem', color: '#4b5563' }}>{t.date?.slice(5) || ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(34,197,94,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700 }}>📋 ALL MANDI PRICES ({prices.length})</span>
          {loading && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Updating...</span>}
        </div>
        {loading && prices.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading mandi prices from data.gov.in...</div>
        ) : prices.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(34,197,94,0.1)' }}>
                  {['Crop','Mandi','District','Min ₹','Modal ₹','Max ₹','Trend','Date'].map(h => (
                    <th key={h} style={{ padding: '0.6rem 1rem', fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prices.map((p: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(34,197,94,0.05)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: '#e2e8d0', fontSize: '0.85rem' }}>{p.crop}</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#9ca3af', fontSize: '0.82rem' }}>{p.mandi_name}</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#9ca3af', fontSize: '0.82rem' }}>{p.district_name}</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#6b7280', fontSize: '0.85rem' }}>₹{p.min_price}</td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>₹{p.modal_price}</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#6b7280', fontSize: '0.85rem' }}>₹{p.max_price}</td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: trendColor(p.trend || 'stable') }}>{trendIcon(p.trend || 'stable')}</td>
                    <td style={{ padding: '0.65rem 1rem', color: '#6b7280', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{p.price_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No prices found for these filters</div>
        )}
      </div>
    </div>
  );
}
