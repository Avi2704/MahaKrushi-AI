'use client';
import { useState } from 'react';
import { CROP_RECOMMENDATIONS, DISTRICTS } from '@/lib/data';

const PROFITABILITY: Record<string, any> = {
  Onion: { yieldPerAcre: 120, pricePerQ: 1000, costPerAcre: 25000 },
  Cotton: { yieldPerAcre: 8, pricePerQ: 6000, costPerAcre: 35000 },
  Soybean: { yieldPerAcre: 12, pricePerQ: 4200, costPerAcre: 15000 },
  Grapes: { yieldPerAcre: 100, pricePerQ: 4500, costPerAcre: 80000 },
  Sugarcane: { yieldPerAcre: 350, pricePerQ: 300, costPerAcre: 40000 },
  Pomegranate: { yieldPerAcre: 80, pricePerQ: 6000, costPerAcre: 60000 },
  Wheat: { yieldPerAcre: 18, pricePerQ: 2250, costPerAcre: 12000 },
  Tur: { yieldPerAcre: 6, pricePerQ: 6500, costPerAcre: 18000 },
  Banana: { yieldPerAcre: 280, pricePerQ: 1100, costPerAcre: 45000 },
  Maize: { yieldPerAcre: 25, pricePerQ: 1750, costPerAcre: 14000 },
};

export default function AdvisoryPage() {
  const [district, setDistrict] = useState('Nashik');
  const [crop, setCrop] = useState('Onion');
  const [area, setArea] = useState('1');
  const [irrigation, setIrrigation] = useState('drip');
  const [result, setResult] = useState<any>(null);

  const reco = CROP_RECOMMENDATIONS[district] || CROP_RECOMMENDATIONS['Nashik'];
  const crops = Object.keys(PROFITABILITY);
  const districts = Object.keys(CROP_RECOMMENDATIONS);

  const calculate = () => {
    const d = PROFITABILITY[crop];
    const acres = parseFloat(area) || 1;
    const irrBonus = irrigation === 'drip' ? 1.2 : irrigation === 'sprinkler' ? 1.1 : 1.0;
    const totalYield = d.yieldPerAcre * acres * irrBonus;
    const grossRevenue = totalYield * d.pricePerQ;
    const totalCost = d.costPerAcre * acres;
    const netProfit = grossRevenue - totalCost;
    setResult({
      totalYield: totalYield.toFixed(1),
      grossRevenue: grossRevenue.toFixed(0),
      totalCost: totalCost.toFixed(0),
      netProfit: netProfit.toFixed(0),
      roi: ((netProfit / totalCost) * 100).toFixed(1),
      breakEven: (totalCost / totalYield).toFixed(0),
      profitable: netProfit > 0,
    });
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>🌱 Crop Advisory & Profitability</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>AI-powered crop recommendations and profitability calculator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Calculator */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1.25rem' }}>💰 PROFITABILITY CALCULATOR</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label>Crop</label>
              <select value={crop} onChange={e => setCrop(e.target.value)}>
                {crops.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Land Area (Acres)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} min="0.1" step="0.5" />
            </div>
            <div>
              <label>Irrigation Type</label>
              <select value={irrigation} onChange={e => setIrrigation(e.target.value)}>
                <option value="drip">Drip (+20% yield)</option>
                <option value="sprinkler">Sprinkler (+10% yield)</option>
                <option value="flood">Flood (standard)</option>
              </select>
            </div>
            <div>
              <label>Season</label>
              <select>
                <option>Kharif (Jun–Oct)</option>
                <option>Rabi (Oct–Mar)</option>
                <option>Summer</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>🔢 Calculate Profit</button>

          {result && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: result.profitable ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', borderRadius: '0.75rem', border: `1px solid ${result.profitable ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: result.profitable ? '#22c55e' : '#ef4444', marginBottom: '0.75rem' }}>
                {result.profitable ? '✅ Profitable Crop' : '⚠️ Loss-making at current prices'}
              </div>
              {[
                { label: 'Expected Yield', value: `${result.totalYield} quintals`, color: '#e2e8d0' },
                { label: 'Gross Revenue', value: `₹${Number(result.grossRevenue).toLocaleString()}`, color: '#22c55e' },
                { label: 'Total Cost', value: `₹${Number(result.totalCost).toLocaleString()}`, color: '#ef4444' },
                { label: 'Net Profit', value: `₹${Number(result.netProfit).toLocaleString()}`, color: result.profitable ? '#22c55e' : '#ef4444' },
                { label: 'ROI', value: `${result.roi}%`, color: '#f59e0b' },
                { label: 'Break-even Price', value: `₹${result.breakEven}/quintal`, color: '#9ca3af' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid rgba(34,197,94,0.06)', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6b7280' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e' }}>🎯 CROP RECOMMENDATIONS</h3>
            <select value={district} onChange={e => setDistrict(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1rem', background: 'rgba(34,197,94,0.06)', borderRadius: '0.6rem', padding: '0.75rem', fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
            📍 {reco.reason}
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700, marginBottom: '0.5rem' }}>⭐ PRIMARY CROPS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {reco.primary.map((c: string) => (
                <button key={c} onClick={() => setCrop(c)} style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem' }}>➕ SECONDARY CROPS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {reco.secondary.map((c: string) => (
                <button key={c} onClick={() => setCrop(c)} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'rgba(34,197,94,0.05)', borderRadius: '0.6rem', fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5 }}>
            💡 Click any crop to auto-fill the profitability calculator →
          </div>
        </div>
      </div>

      {/* All districts recommendations table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>📋 DISTRICT-WISE RECOMMENDATIONS</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>District</th><th>Primary Crops</th><th>Secondary Crops</th><th>Reason</th></tr></thead>
            <tbody>
              {Object.entries(CROP_RECOMMENDATIONS).map(([name, data]: [string, any]) => (
                <tr key={name} onClick={() => setDistrict(name)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, color: '#22c55e' }}>{name}</td>
                  <td>{data.primary.join(', ')}</td>
                  <td style={{ color: '#9ca3af' }}>{data.secondary.join(', ')}</td>
                  <td style={{ color: '#6b7280', fontSize: '0.8rem', maxWidth: '250px' }}>{data.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
