'use client';
import { useState, useEffect } from 'react';
import { notificationsApi, getUser } from '@/lib/api';
import Link from 'next/link';

const TYPE_ICONS: Record<string, string> = {
  weather_alert: '🌦️', price_change: '📊', equipment: '🚜',
  advisory: '🌱', pest: '🐛', storage: '❄️', default: '🔔'
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) loadNotifications();
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadNotifications();
  }, [unreadOnly]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [ndata, nc] = await Promise.all([
        notificationsApi.list(unreadOnly),
        notificationsApi.unreadCount()
      ]);
      setNotifs(ndata.data || []);
      setUnreadCount(nc.unread_count || 0);
    } catch {}
    setLoading(false);
  };

  const markRead = async (id: number) => {
    await notificationsApi.markRead(id);
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifs(ns => ns.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  if (!user) return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
      <h2 style={{ color: '#f0fdf4', marginBottom: '0.5rem' }}>Login to view notifications</h2>
      <Link href="/auth" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Login now</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0fdf4' }}>🔔 Notifications</h1>
          {unreadCount > 0 && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.2rem' }}>{unreadCount} unread</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setUnreadOnly(!unreadOnly)} style={{ padding: '0.4rem 0.85rem', borderRadius: '0.4rem', border: '1px solid rgba(34,197,94,0.3)', background: unreadOnly ? 'rgba(34,197,94,0.1)' : 'transparent', color: unreadOnly ? '#22c55e' : '#6b7280', cursor: 'pointer', fontSize: '0.8rem' }}>
            {unreadOnly ? '✅ Unread only' : 'All notifications'}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ padding: '0.4rem 0.85rem', borderRadius: '0.4rem', border: '1px solid rgba(34,197,94,0.3)', background: 'transparent', color: '#22c55e', cursor: 'pointer', fontSize: '0.8rem' }}>Mark all read</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading notifications...</div>
      ) : notifs.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
          <div style={{ color: '#e2e8d0', fontWeight: 600, marginBottom: '0.25rem' }}>No notifications</div>
          <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{unreadOnly ? 'No unread notifications' : 'You are all caught up!'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} style={{ padding: '1rem 1.25rem', background: n.is_read ? 'rgba(13,26,14,0.6)' : 'rgba(34,197,94,0.06)', border: `1px solid ${n.is_read ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.25)'}`, borderRadius: '0.75rem', cursor: n.is_read ? 'default' : 'pointer', transition: 'all 0.2s', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{TYPE_ICONS[n.type] || TYPE_ICONS.default}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: n.is_read ? 500 : 700, color: n.is_read ? '#9ca3af' : '#f0fdf4', fontSize: '0.9rem' }}>{n.title}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>{n.message}</p>
              </div>
              {!n.is_read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0, marginTop: '4px' }}></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
