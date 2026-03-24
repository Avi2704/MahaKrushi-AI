'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const nav = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/weather', icon: '🌦️', label: 'Weather' },
  { href: '/dashboard/satellite', icon: '🛰️', label: 'Satellite' },
  { href: '/dashboard/disease', icon: '🔬', label: 'Disease AI' },
  { href: '/dashboard/mandi', icon: '📊', label: 'Mandi Prices' },
  { href: '/dashboard/advisory', icon: '🌱', label: 'Crop Advisory' },
  { href: '/dashboard/pest', icon: '🐛', label: 'Pest Prediction' },
  { href: '/dashboard/assistant', icon: '🤖', label: 'AI Assistant' },
  { href: '/dashboard/labs', icon: '🧪', label: 'Lab Directory' },
  { href: '/dashboard/equipment', icon: '🚜', label: 'Equipment Rental' },
  { href: '/dashboard/storage', icon: '❄️', label: 'Cold Storage' },
  { href: '/dashboard/infra-map', icon: '🗺️', label: 'Infra Map' },
  { href: '/dashboard/calendar', icon: '📅', label: 'Crop Calendar' },
  { href: '/dashboard/drought', icon: '🏜️', label: 'Drought Map' },
  { href: '/dashboard/profile', icon: '👨‍🌾', label: 'My Profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f0a' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '64px' : '225px', minHeight: '100vh', background: 'rgba(13,26,14,0.98)',
        borderRight: '1px solid rgba(34,197,94,0.12)', display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '64px' }}>
          <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🌾</span>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#22c55e', lineHeight: 1.1 }}>MahaKrushi</div>
              <div style={{ fontSize: '0.6rem', color: '#4b5563' }}>AI Platform</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', scrollbarWidth: 'thin' }}>
          {nav.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem', padding: collapsed ? '0.7rem' : '0.65rem 0.85rem',
                  borderRadius: '0.65rem', marginBottom: '0.15rem', cursor: 'pointer', transition: 'all 0.2s',
                  background: isActive ? 'rgba(34,197,94,0.12)' : 'transparent',
                  borderLeft: isActive ? '2px solid #22c55e' : '2px solid transparent',
                  color: isActive ? '#22c55e' : '#6b7280', justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.06)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(34,197,94,0.1)' }}>
            <Link href="/auth" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: 'linear-gradient(135deg,rgba(22,163,74,0.2),rgba(21,128,61,0.2))', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.75rem', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👤</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>Farmer Account</div>
                  <div style={{ fontSize: '0.65rem', color: '#4b5563' }}>Sign in / Register</div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minHeight: '100vh', overflowX: 'hidden' }}>
        {/* Top bar */}
        <div style={{ background: 'rgba(13,26,14,0.8)', borderBottom: '1px solid rgba(34,197,94,0.1)', padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            <Link href="/" style={{ color: '#22c55e', textDecoration: 'none' }}>Home</Link> / <span style={{ color: '#9ca3af' }}>{pathname.split('/').filter(Boolean).join(' / ') || 'Dashboard'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>🔴 Live</span>
            <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}>📍 Nashik, MH</span>
          </div>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
