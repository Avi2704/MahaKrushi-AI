'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, setTokens, setUser } from '@/lib/api';

type Mode = 'login' | 'register';
type Role = 'farmer' | 'equipment_owner' | 'storage_owner';

const ROLES = [
  { value: 'farmer', icon: '👨‍🌾', label: 'Farmer', label_mr: 'शेतकरी' },
  { value: 'equipment_owner', icon: '🚜', label: 'Equipment Owner', label_mr: 'यंत्र मालक' },
  { value: 'storage_owner', icon: '❄️', label: 'Storage Owner', label_mr: 'साठवण मालक' },
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(''); // dev: show OTP

  const [form, setForm] = useState({
    full_name: '', mobile: '', email: '', password: '', otp: ''
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const data = await authApi.login(form.mobile, form.password);
      setTokens(data.access_token, data.refresh_token);
      setUser({ id: data.user_id, role: data.role, full_name: data.full_name });
      router.push('/dashboard');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true); setError('');
    try {
      const data = await authApi.register({
        full_name: form.full_name, mobile: form.mobile, email: form.email,
        password: form.password, role, preferred_language: 'mr'
      });
      setTokens(data.access_token, data.refresh_token);
      setUser({ id: data.user_id, role: data.role, full_name: data.full_name });
      router.push('/dashboard');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const handleOtpRequest = async () => {
    setLoading(true); setError('');
    try {
      const data = await authApi.requestOtp(form.mobile);
      setOtpStep(true);
      setGeneratedOtp(data.otp || '');  // dev: display OTP
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const handleOtpVerify = async () => {
    setLoading(true); setError('');
    try {
      const data = await authApi.verifyOtp(form.mobile, form.otp);
      setTokens(data.access_token, data.refresh_token);
      setUser({ id: data.user_id, role: data.role, full_name: data.full_name });
      router.push('/dashboard');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 20%, #0d260d 0%, #0a0f0a 60%), radial-gradient(ellipse at 80% 80%, #1a2f0a 0%, transparent 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🌾</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, background: 'linear-gradient(135deg,#22c55e,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MahaKrushi AI</div>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>महाराष्ट्र स्मार्ट शेती प्लॅटफॉर्म</div>
        </div>

        <div style={{ background: 'rgba(13,26,14,0.95)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(16px)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          {/* Mode Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: 'rgba(34,197,94,0.06)', borderRadius: '0.6rem', padding: '0.25rem', marginBottom: '1.5rem' }}>
            {(['login', 'register'] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setOtpStep(false); }} style={{ padding: '0.6rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: mode === m ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'transparent', color: mode === m ? 'white' : '#6b7280', transition: 'all 0.2s' }}>
                {m === 'login' ? '🔑 Login' : '📋 Register'}
              </button>
            ))}
          </div>

          {/* Role Select (Register) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Account Type / खाते प्रकार</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setRole(r.value as Role)} style={{ padding: '0.6rem 0.4rem', borderRadius: '0.5rem', border: `1px solid ${role === r.value ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.15)'}`, background: role === r.value ? 'rgba(34,197,94,0.12)' : 'transparent', color: role === r.value ? '#22c55e' : '#6b7280', cursor: 'pointer', fontSize: '0.72rem', fontWeight: role === r.value ? 700 : 400, textAlign: 'center', transition: 'all 0.2s', lineHeight: 1.4 }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{r.icon}</div>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {mode === 'register' && (
              <>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.3rem' }}>Full Name / पूर्ण नाव</label>
                  <input value={form.full_name} onChange={update('full_name')} placeholder="Ramesh Patil / रमेश पाटील" className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.3rem' }}>Email (optional)</label>
                  <input value={form.email} onChange={update('email')} type="email" placeholder="ramesh@example.com" className="input-field" />
                </div>
              </>
            )}
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.3rem' }}>Mobile Number / मोबाईल नंबर</label>
              <input value={form.mobile} onChange={update('mobile')} type="tel" placeholder="9823000000" className="input-field" />
            </div>
            {!otpStep && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.3rem' }}>Password / पासवर्ड</label>
                <input value={form.password} onChange={update('password')} type="password" placeholder="••••••••" className="input-field" />
              </div>
            )}
            {otpStep && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#22c55e', display: 'block', marginBottom: '0.3rem' }}>
                  Enter OTP {generatedOtp && <span style={{ background: 'rgba(34,197,94,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>Dev OTP: {generatedOtp}</span>}
                </label>
                <input value={form.otp} onChange={update('otp')} placeholder="6-digit OTP" className="input-field" maxLength={6} />
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div style={{ marginTop: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>⚠️ {error}</div>}

          {/* Submit */}
          <button
            disabled={loading}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem', background: loading ? '#374151' : 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', borderRadius: '0.75rem', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🌾 Login to Dashboard' : '✅ Create Account'}
          </button>

          {/* OTP Login alternate (for login mode) */}
          {mode === 'login' && !otpStep && (
            <button onClick={handleOtpRequest} disabled={loading || !form.mobile} style={{ width: '100%', marginTop: '0.6rem', padding: '0.7rem', background: 'transparent', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '0.75rem', color: '#22c55e', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              📱 Login with OTP instead
            </button>
          )}
          {otpStep && (
            <button onClick={handleOtpVerify} disabled={loading || form.otp.length < 4} style={{ width: '100%', marginTop: '0.6rem', padding: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '0.75rem', color: '#22c55e', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              ✅ Verify OTP & Login
            </button>
          )}

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#6b7280' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
              {mode === 'login' ? 'Register now' : 'Login here'}
            </button>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: '1rem', padding: '0.7rem', background: 'rgba(245,158,11,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center' }}>
            💡 <strong style={{ color: '#f59e0b' }}>Demo:</strong> Mobile: <code>9800000001</code> | Password: <code>farm1234</code>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#4b5563', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
