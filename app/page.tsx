'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const features = [
  { icon: '🌦️', title: 'Weather Intelligence', desc: 'District-wise weather alerts, rainfall prediction, heatwave & storm warnings.', href: '/dashboard/weather' },
  { icon: '🛰️', title: 'Satellite Crop Health', desc: 'Real-time NDVI/EVI vegetation index monitoring and drought stress detection.', href: '/dashboard/satellite' },
  { icon: '🔬', title: 'AI Disease Detection', desc: 'Upload crop images. AI detects cotton bollworm, soybean rust, grape mildew.', href: '/dashboard/disease' },
  { icon: '📊', title: 'Mandi Price Intelligence', desc: 'Live prices from Lasalgaon, Pune, Nagpur, Solapur mandis with trend charts.', href: '/dashboard/mandi' },
  { icon: '🌱', title: 'Crop Advisory', desc: 'AI-powered profitability calculator and seasonal crop recommendations.', href: '/dashboard/advisory' },
  { icon: '🐛', title: 'Pest Outbreak Prediction', desc: 'Predict Pink Bollworm risk in cotton districts using climate and history data.', href: '/dashboard/pest' },
  { icon: '🧪', title: 'Lab Directory', desc: 'Maharashtra-wide soil & seed testing lab finder with nearest lab search.', href: '/dashboard/labs' },
  { icon: '🚜', title: 'Equipment Rental', desc: 'Peer-to-peer tractor, harvester, drone rental marketplace across Maharashtra.', href: '/dashboard/equipment' },
  { icon: '❄️', title: 'Cold Storage Locator', desc: 'Find nearest cold storage for onion, grapes, pomegranate and more crops.', href: '/dashboard/storage' },
];

const stats = [
  { label: 'Districts', value: '36', icon: '🗺️' },
  { label: 'Registered Farmers', value: '1M+', icon: '👨‍🌾' },
  { label: 'Mandi Prices Tracked', value: '50+', icon: '📈' },
  { label: 'Labs Listed', value: '200+', icon: '🧪' },
  { label: 'Equipment Listings', value: '5,000+', icon: '🚜' },
  { label: 'Cold Storages', value: '300+', icon: '❄️' },
];

const regions = ['Vidarbha', 'Marathwada', 'Western Maharashtra', 'Konkan', 'North Maharashtra'];
const crops = ['Cotton', 'Soybean', 'Sugarcane', 'Onion', 'Grapes', 'Pomegranate', 'Banana', 'Orange', 'Wheat', 'Tur'];

export default function Home() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % features.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ background: '#0a0f0a', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(34,197,94,0.15)', background: 'rgba(10,15,10,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, padding: '0 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🌾</span>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg,#22c55e,#16a34a,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MahaKrushi AI</div>
              <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '-2px' }}>महाकृषी एआय – महाराष्ट्र</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: '#9ca3af', fontSize: '0.9rem', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/dashboard/labs" style={{ color: '#9ca3af', fontSize: '0.9rem', textDecoration: 'none' }}>Labs</Link>
            <Link href="/dashboard/equipment" style={{ color: '#9ca3af', fontSize: '0.9rem', textDecoration: 'none' }}>Equipment</Link>
            <Link href="/auth" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.6rem', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle,rgba(34,197,94,0.08),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(245,158,11,0.05),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '9999px', padding: '0.35rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>
            🚀 Now Live – Maharashtra's #1 AgriAI Platform
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: '#f0fdf4' }}>
            Smart Farming for<br />
            <span style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Maharashtra's Farmers</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#9ca3af', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Satellite crop monitoring, AI disease detection, mandi price intelligence, equipment rental, and agricultural infrastructure — all in one platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem', textDecoration: 'none', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: 'white', borderRadius: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              🌾 Open Dashboard
            </Link>
            <Link href="/auth" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.85rem 2rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid rgba(34,197,94,0.3)' }}>
              Register as Farmer
            </Link>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Marathi', 'Hindi', 'English'].map(lang => (
              <span key={lang} style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✓ {lang} Support</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(34,197,94,0.1)', borderBottom: '1px solid rgba(34,197,94,0.1)', background: 'rgba(13,26,14,0.5)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1.5rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f0fdf4', marginBottom: '0.75rem' }}>Complete Agriculture Intelligence</h2>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>9 integrated AI-powered modules covering all aspects of Maharashtra farming</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s', border: active === i ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(34,197,94,0.15)', boxShadow: active === i ? '0 8px 30px rgba(34,197,94,0.15)' : 'none', transform: active === i ? 'translateY(-3px)' : 'none' }}
                onMouseEnter={() => setActive(i)}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ color: '#e2e8d0', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5 }}>{f.desc}</p>
                <div style={{ marginTop: '1rem', color: '#22c55e', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Open Module →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Regions & Crops */}
      <section style={{ padding: '3rem 2rem', background: 'rgba(13,26,14,0.4)', borderTop: '1px solid rgba(34,197,94,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h3 style={{ color: '#22c55e', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>🗺️ Regions Covered</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {regions.map(r => (
                <span key={r} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 500 }}>{r}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>🌾 Crops Supported</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {crops.map(c => (
                <span key={c} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 500 }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'linear-gradient(135deg,rgba(22,163,74,0.1),rgba(245,158,11,0.05))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '1.5rem', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0fdf4', marginBottom: '1rem' }}>माझ्या शेतात कोणते पीक घ्यावे?</h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', lineHeight: 1.6 }}>Ask our Marathi AI Assistant for personalized crop recommendations based on your district, soil type, and season.</p>
          <Link href="/dashboard/assistant" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: 'white', padding: '0.9rem 2rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
            🤖 Open AI Assistant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(34,197,94,0.1)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.5rem' }}>🌾 MahaKrushi AI</div>
        <p style={{ color: '#4b5563', fontSize: '0.85rem' }}>Maharashtra Smart Farming Intelligence Platform • © 2025</p>
      </footer>
    </main>
  );
}
