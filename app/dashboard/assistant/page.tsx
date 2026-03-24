'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type Lang = 'mr' | 'hi' | 'en';
type Mode = 'simple' | 'expert';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  cards?: CardData[];
  lang: Lang;
  timestamp: Date;
}
interface CardData {
  type: 'weather' | 'mandi' | 'lab' | 'equipment' | 'storage' | 'disease';
  data: Record<string, unknown>;
}
interface Suggestion { label: string; query: string; }

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function sendChat(msg: string, lang: Lang, mode: Mode, token: string, district?: string, crop?: string) {
  const r = await fetch(`${API}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg, language: lang, mode, session_token: token, district, crop }),
  });
  if (!r.ok) throw new Error('err');
  return r.json() as Promise<{ reply: string; intent: string; response_type: string; cards: CardData[] }>;
}

async function fetchSuggestions(lang: Lang, district?: string, crop?: string): Promise<Suggestion[]> {
  const q = new URLSearchParams({ lang, ...(district ? { district } : {}), ...(crop ? { crop } : {}) });
  const r = await fetch(`${API}/assistant/suggestions?${q}`);
  const d = await r.json();
  return d.suggestions ?? [];
}

function renderMd(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#86efac">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.+)$/gm, '<h3 style="color:#4ade80;font-size:1rem;margin:8px 0 4px">$1</h3>')
    .replace(/^• (.+)$/gm, '<li style="margin-left:16px;list-style:disc;margin-bottom:2px">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left:16px;list-style:decimal;margin-bottom:2px">$2</li>')
    .replace(/\n/g, '<br/>');
}

/* ── Card components ─────────────────────────────────────────────── */
function WeatherCard({ data }: { data: Record<string, unknown> }) {
  const d = data as { temperature?: number; condition?: string; icon?: string; humidity?: number; wind_speed_kmh?: number; district?: string };
  return (
    <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(14,116,144,0.18)', border: '1px solid rgba(34,211,238,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 26 }}>{d.icon ?? '🌤️'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#e0f2fe', fontWeight: 700, fontSize: '0.88rem' }}>{d.district} — {d.temperature}°C</div>
          <div style={{ color: '#7dd3fc', fontSize: '0.75rem' }}>{d.condition}</div>
        </div>
        <div style={{ fontSize: '0.72rem', textAlign: 'right', color: '#67e8f9' }}>
          <div>💧 {d.humidity}%</div><div>💨 {d.wind_speed_kmh} km/h</div>
        </div>
      </div>
    </div>
  );
}
function MandiCard({ data }: { data: Record<string, unknown> }) {
  const d = data as { mandi_name?: string; crop?: string; modal_price?: number; trend?: string; district_name?: string };
  return (
    <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(5,122,85,0.18)', border: '1px solid rgba(52,211,153,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ color: '#6ee7b7', fontWeight: 700, fontSize: '0.85rem' }}>🌾 {d.crop}</div><div style={{ color: '#a7f3d0', fontSize: '0.72rem' }}>{d.mandi_name}, {d.district_name}</div></div>
        <div style={{ textAlign: 'right' }}><div style={{ color: '#fde68a', fontWeight: 700 }}>₹{d.modal_price?.toLocaleString()}/q</div><div style={{ fontSize: '0.7rem', color: d.trend === 'up' ? '#4ade80' : d.trend === 'down' ? '#f87171' : '#fbbf24' }}>{d.trend === 'up' ? '📈' : d.trend === 'down' ? '📉' : '➡️'} {d.trend}</div></div>
      </div>
    </div>
  );
}
function LabCard({ data }: { data: Record<string, unknown> }) {
  const d = data as { name?: string; city?: string; lab_type?: string; phone?: string; is_verified?: boolean };
  return (
    <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(88,28,220,0.16)', border: '1px solid rgba(167,139,250,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ color: '#c4b5fd', fontWeight: 700, fontSize: '0.85rem' }}>🧪 {d.name} {d.is_verified && <span style={{ fontSize: '0.62rem', color: '#4ade80', marginLeft: 4 }}>✓ Gov</span>}</div><div style={{ color: '#ddd6fe', fontSize: '0.72rem' }}>{d.city} • {d.lab_type}</div></div>
        {d.phone && <a href={`tel:${d.phone}`} style={{ fontSize: '0.72rem', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '4px 10px', textDecoration: 'none' }}>📞 Call</a>}
      </div>
    </div>
  );
}
function EquipmentCard({ data }: { data: Record<string, unknown> }) {
  const d = data as { equipment_name?: string; brand?: string; category?: string; price_per_day?: number; contact_number?: string };
  return (
    <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(146,64,14,0.2)', border: '1px solid rgba(251,146,60,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ color: '#fcd34d', fontWeight: 700, fontSize: '0.85rem' }}>🚜 {d.equipment_name}</div><div style={{ color: '#fed7aa', fontSize: '0.72rem' }}>{d.brand} • {d.category}</div></div>
        <div style={{ textAlign: 'right' }}><div style={{ color: '#fbbf24', fontWeight: 700 }}>₹{d.price_per_day}/day</div>{d.contact_number && <a href={`tel:${d.contact_number}`} style={{ fontSize: '0.7rem', color: '#4ade80', textDecoration: 'none', display: 'block' }}>📞 Inquire</a>}</div>
      </div>
    </div>
  );
}
function StorageCard({ data }: { data: Record<string, unknown> }) {
  const d = data as { name?: string; city?: string; capacity_tons?: number; available_capacity?: number; storage_type?: string };
  const pct = d.capacity_tons ? Math.round(((d.available_capacity ?? 0) / d.capacity_tons) * 100) : 0;
  return (
    <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(8,145,178,0.16)', border: '1px solid rgba(34,211,238,0.2)' }}>
      <div style={{ color: '#67e8f9', fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>❄️ {d.name}</div>
      <div style={{ color: '#a5f3fc', fontSize: '0.72rem', marginBottom: 6 }}>{d.city} • {d.storage_type}</div>
      <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 20, height: 5, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#06b6d4,#22d3ee)', borderRadius: 20 }} /></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.7rem', color: '#94a3b8' }}><span>{d.available_capacity}t free / {d.capacity_tons}t</span><span style={{ color: '#22d3ee' }}>{pct}% available</span></div>
    </div>
  );
}
function Cards({ cards }: { cards: CardData[] }) {
  if (!cards?.length) return null;
  return <div style={{ marginTop: 4 }}>{cards.map((c, i) => {
    if (c.type === 'weather') return <WeatherCard key={i} data={c.data} />;
    if (c.type === 'mandi') return <MandiCard key={i} data={c.data} />;
    if (c.type === 'lab') return <LabCard key={i} data={c.data} />;
    if (c.type === 'equipment') return <EquipmentCard key={i} data={c.data} />;
    if (c.type === 'storage') return <StorageCard key={i} data={c.data} />;
    return null;
  })}</div>;
}

/* ── Message bubble ──────────────────────────────────────────────── */
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 10, marginBottom: 14, animation: 'mkIn 0.25s ease-out' }}>
      {!isUser && <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#16a34a,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, boxShadow: '0 3px 10px rgba(22,163,74,0.35)', border: '1.5px solid rgba(74,222,128,0.2)' }}>🌱</div>}
      <div style={{ maxWidth: '76%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {!isUser && <div style={{ fontSize: '0.63rem', color: '#4ade80', fontWeight: 700, marginBottom: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>MahaKrushi AI</div>}
        <div style={{ padding: '11px 15px', borderRadius: isUser ? '16px 16px 3px 16px' : '16px 16px 16px 3px', fontSize: '0.875rem', lineHeight: 1.65, color: isUser ? '#fff' : '#cbd5e1', background: isUser ? 'linear-gradient(135deg,#16a34a,#059669)' : 'rgba(15,23,42,0.8)', border: isUser ? 'none' : '1px solid rgba(30,41,59,0.9)', backdropFilter: 'blur(10px)', boxShadow: isUser ? '0 3px 14px rgba(22,163,74,0.25)' : '0 3px 14px rgba(0,0,0,0.2)', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }} />
        {!isUser && msg.cards && msg.cards.length > 0 && <Cards cards={msg.cards} />}
        <div style={{ fontSize: '0.6rem', color: '#334155', marginTop: 4, paddingInline: 3 }}>{msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      {isUser && <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, boxShadow: '0 3px 10px rgba(37,99,235,0.35)', border: '1.5px solid rgba(99,102,241,0.2)' }}>👤</div>}
    </div>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14, animation: 'mkIn 0.25s ease-out' }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#16a34a,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🌱</div>
      <div style={{ padding: '11px 16px', borderRadius: '16px 16px 16px 3px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(30,41,59,0.9)', display: 'flex', alignItems: 'center', gap: 10 }}>
        {[0, 150, 300].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'mkBounce 1.2s infinite ease-in-out', animationDelay: `${d}ms` }} />)}
        <span style={{ fontSize: '0.78rem', color: '#475569' }}>{label}</span>
      </div>
    </div>
  );
}

const CHIP_MAP: [string, string][] = [['हवामान','🌦️'],['मंडी','📊'],['पीक','🌾'],['रोग','🔬'],['जमीन','🌱'],['सिंचन','💧'],['यंत्र','🚜'],['ट्रॅक्टर','🚜'],['weather','🌦️'],['market','📊'],['disease','🔬'],['soil','🌱'],['tractor','🚜'],['irrigation','💧']];
const getChipIcon = (label: string) => { for (const [k,v] of CHIP_MAP) if (label.includes(k)) return v; return '💬'; };

const GREETING: Record<Lang, string> = {
  mr: '🙏 नमस्कार! मी MahaKrushi AI — महाराष्ट्रातील शेतकऱ्यांसाठी तुमचा कृषी सहाय्यक.\n\nखाली **त्वरित प्रश्न** निवडा किंवा तुमचा प्रश्न थेट टाइप करा. मी हवामान, मंडी भाव, रोग धोका, जवळची लॅब, यंत्र भाडे आणि बरेच काही सांगू शकतो! 🌱',
  hi: '🙏 नमस्ते! मैं MahaKrushi AI — महाराष्ट्र के किसानों का कृषि सहायक।\n\nनीचे **त्वरित प्रश्न** चुनें या सीधे टाइप करें। मौसम, मंडी भाव, रोग खतरा, नजदीकी लैब और बहुत कुछ! 🌱',
  en: '🙏 Welcome to MahaKrushi AI — your agricultural copilot for Maharashtra.\n\nChoose a **quick prompt** below or type your question. I can help with weather, mandi prices, disease risk, nearest labs, equipment rentals, and much more! 🌱',
};

const TYPING_LABEL: Record<Lang, string> = { mr: 'विचार करत आहे...', hi: 'सोच रहा हूँ...', en: 'Thinking...' };
const PLACEHOLDER: Record<Lang, string> = { mr: 'तुमचा प्रश्न टाइप करा...', hi: 'अपना प्रश्न टाइप करें...', en: 'Ask about weather, prices, crops...' };
const FOOTER_HINT: Record<Lang, string> = { mr: 'Enter → पाठवा  ·  Shift+Enter → नवीन ओळ  ·  AI सल्ला व्यावसायिक सल्ल्याची जागा घेत नाही', hi: 'Enter → भेजें  ·  Shift+Enter → नई पंक्ति  ·  AI सलाह पेशेवर सलाह का विकल्प नहीं', en: 'Enter to send  ·  Shift+Enter for new line  ·  AI advice ≠ professional consultation' };
const REPLY_LANG_LABEL: Record<Lang, string> = { mr: 'उत्तर भाषा', hi: 'जवाब भाषा', en: 'Reply in' };
const CLEAR_LABEL: Record<Lang, string> = { mr: 'साफ करा', hi: 'साफ करें', en: 'Clear' };
const MODE_LABEL: Record<Mode, Record<Lang, string>> = { simple: { mr: '💡 सोपा', hi: '💡 सरल', en: '💡 Simple' }, expert: { mr: '⚗️ तज्ञ', hi: '⚗️ विशेषज्ञ', en: '⚗️ Expert' } };

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [uiLang, setUiLang] = useState<Lang>('mr');     // controls UI labels
  const [replyLang, setReplyLang] = useState<Lang>('mr'); // controls AI reply language
  const [mode, setMode] = useState<Mode>('simple');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [focused, setFocused] = useState(false);
  const [district] = useState('Nashik');
  const [sessionToken] = useState(() => `sess_${Math.random().toString(36).slice(2, 10)}`);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { fetchSuggestions(uiLang, district).then(setSuggestions).catch(() => {}); }, [uiLang, district]);

  useEffect(() => {
    setMessages([{ id: 'g', role: 'assistant', content: GREETING[replyLang], lang: uiLang, timestamp: new Date() }]);
  }, [uiLang, replyLang]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: 'user', content: text.trim(), lang: uiLang, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    try {
      const res = await sendChat(text.trim(), replyLang, mode, sessionToken, district);
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: res.reply, intent: res.intent, cards: res.cards?.filter(Boolean) ?? [], lang: uiLang, timestamp: new Date() }]);
    } catch {
      setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant', content: replyLang === 'mr' ? '⚠️ माफ करा, सेवा उपलब्ध नाही. पुन्हा प्रयत्न करा.' : replyLang === 'hi' ? '⚠️ सेवा अनुपलब्ध है। पुनः प्रयास करें।' : '⚠️ Service unavailable. Please try again.', lang: uiLang, timestamp: new Date() }]);
    } finally { setIsTyping(false); inputRef.current?.focus(); }
  }, [replyLang, mode, sessionToken, district, isTyping, uiLang]);

  const clearChat = () => setMessages([{ id: 'c', role: 'assistant', content: GREETING[replyLang], lang: uiLang, timestamp: new Date() }]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes mkIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes mkBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-5px); } }
        @keyframes mkPulse { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
        .mk-pill:hover { background:rgba(22,163,74,0.2) !important; color:#4ade80 !important; border-color:rgba(74,222,128,0.45) !important; }
        .mk-chip:hover { background:rgba(22,163,74,0.15) !important; color:#4ade80 !important; border-color:rgba(74,222,128,0.4) !important; transform:translateY(-1px); }
        .mk-send:hover:not(:disabled) { transform:scale(1.06); box-shadow:0 6px 22px rgba(22,163,74,0.55) !important; }
        button { font-family:'Inter',sans-serif; }
        textarea { font-family:'Inter',sans-serif; }
        .mk-scroll::-webkit-scrollbar { width:4px; }
        .mk-scroll::-webkit-scrollbar-track { background:transparent; }
        .mk-scroll::-webkit-scrollbar-thumb { background:rgba(74,222,128,0.18); border-radius:99px; }
      `}</style>

      <div style={{ fontFamily: "'Inter',sans-serif", display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ══════════════════════════════════════════════════════
            ROW 1 — Brand + Controls (always visible)
        ══════════════════════════════════════════════════════ */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(2,10,4,0.95),rgba(4,16,8,0.95))',
          border: '1px solid rgba(22,163,74,0.15)',
          borderRadius: '16px 16px 0 0',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
          backdropFilter: 'blur(16px)',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg,#16a34a,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 14px rgba(22,163,74,0.4)', border: '1.5px solid rgba(74,222,128,0.2)', flexShrink: 0 }}>🌱</div>
            <div>
              <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>MahaKrushi AI सहाय्यक</div>
              <div style={{ color: '#4ade80', fontSize: '0.68rem', fontWeight: 500, opacity: 0.8 }}>महाराष्ट्र शेती बुद्धिमत्ता प्लॅटफॉर्म</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 20, padding: '3px 9px', marginLeft: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'mkPulse 2s infinite' }} />
              <span style={{ color: '#4ade80', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>

            {/* ── REPLY LANGUAGE ── big visible pill group */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
              <span style={{ fontSize: '0.58rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 2 }}>
                💬 {REPLY_LANG_LABEL[uiLang]}
              </span>
              <div style={{ display: 'flex', background: 'rgba(8,16,10,0.9)', borderRadius: 10, padding: 3, gap: 2, border: '1px solid rgba(22,163,74,0.2)' }}>
                {(['mr','hi','en'] as Lang[]).map(l => (
                  <button key={l} onClick={() => setReplyLang(l)}
                    style={{
                      padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.18s',
                      background: replyLang === l ? 'linear-gradient(135deg,#16a34a,#059669)' : 'transparent',
                      color: replyLang === l ? '#fff' : '#64748b',
                      boxShadow: replyLang === l ? '0 2px 8px rgba(22,163,74,0.4)' : 'none',
                    }}>
                    {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: 1, height: 36, background: 'rgba(30,41,59,0.7)' }} />

            {/* ── UI LANGUAGE ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
              <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 2 }}>UI Lang</span>
              <div style={{ display: 'flex', background: 'rgba(8,16,10,0.9)', borderRadius: 10, padding: 3, gap: 2, border: '1px solid rgba(30,41,59,0.7)' }}>
                {(['mr','hi','en'] as Lang[]).map(l => (
                  <button key={l} onClick={() => setUiLang(l)} className="mk-pill"
                    style={{
                      padding: '5px 10px', borderRadius: 7, border: '1px solid transparent', cursor: 'pointer',
                      fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.18s',
                      background: uiLang === l ? 'rgba(22,163,74,0.15)' : 'transparent',
                      color: uiLang === l ? '#4ade80' : '#475569',
                    }}>
                    {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'EN'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: 1, height: 36, background: 'rgba(30,41,59,0.7)' }} />

            {/* Mode */}
            <button onClick={() => setMode(m => m === 'simple' ? 'expert' : 'simple')}
              style={{
                padding: '7px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                background: mode === 'expert' ? 'rgba(109,40,217,0.2)' : 'rgba(8,16,10,0.9)',
                color: mode === 'expert' ? '#c4b5fd' : '#64748b',
                border: mode === 'expert' ? '1px solid rgba(167,139,250,0.35)' : '1px solid rgba(30,41,59,0.7)',
                transition: 'all 0.18s',
              }}>
              {MODE_LABEL[mode][uiLang]}
            </button>

            {/* Clear */}
            <button onClick={clearChat}
              style={{ padding: '7px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, background: 'rgba(8,16,10,0.9)', color: '#64748b', border: '1px solid rgba(30,41,59,0.7)', transition: 'all 0.18s' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.color = '#f87171'; b.style.borderColor = 'rgba(248,113,113,0.35)'; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.color = '#64748b'; b.style.borderColor = 'rgba(30,41,59,0.7)'; }}>
              🗑 {CLEAR_LABEL[uiLang]}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            ROW 2 — Quick Prompt Chips
        ══════════════════════════════════════════════════════ */}
        {suggestions.length > 0 && (
          <div style={{ background: 'rgba(2,10,4,0.7)', borderLeft: '1px solid rgba(22,163,74,0.12)', borderRight: '1px solid rgba(22,163,74,0.12)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.62rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75, flexShrink: 0 }}>⚡ {uiLang === 'mr' ? 'त्वरित प्रश्न' : uiLang === 'hi' ? 'त्वरित प्रश्न' : 'Quick Prompts'}</span>
            {suggestions.map((s, i) => (
              <button key={i} className="mk-chip" onClick={() => send(s.query)}
                style={{ padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: '0.76rem', fontWeight: 500, background: 'rgba(8,16,10,0.8)', color: '#64748b', border: '1px solid rgba(30,41,59,0.7)', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all 0.18s' }}>
                <span>{getChipIcon(s.label)}</span><span>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            ROW 3 — Chat messages (scrollable)
        ══════════════════════════════════════════════════════ */}
        <div className="mk-scroll" style={{
          height: 'calc(100vh - 56px - 48px - 180px)',
          minHeight: 280,
          overflowY: 'auto',
          background: 'linear-gradient(160deg,#020d04 0%,#041208 40%,#051a0d 100%)',
          borderLeft: '1px solid rgba(22,163,74,0.12)',
          borderRight: '1px solid rgba(22,163,74,0.12)',
          padding: '20px 24px',
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {messages.map(m => <Bubble key={m.id} msg={m} />)}
            {isTyping && <TypingDots label={TYPING_LABEL[uiLang]} />}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            ROW 4 — Input bar
        ══════════════════════════════════════════════════════ */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(2,10,4,0.97),rgba(4,16,8,0.97))',
          border: '1px solid rgba(22,163,74,0.15)',
          borderRadius: '0 0 16px 16px',
          padding: '14px 20px 16px',
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={PLACEHOLDER[uiLang]}
                  rows={1}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(8,16,10,0.85)',
                    border: `1.5px solid ${focused ? 'rgba(74,222,128,0.5)' : 'rgba(30,41,59,0.9)'}`,
                    borderRadius: 13, padding: '12px 48px 12px 16px',
                    color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.55,
                    resize: 'none', outline: 'none', minHeight: 48, maxHeight: 120,
                    transition: 'border-color 0.18s, box-shadow 0.18s',
                    boxShadow: focused ? '0 0 0 3px rgba(22,163,74,0.1)' : 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                  onInput={e => { const el = e.target as HTMLTextAreaElement; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }}
                />
                <div style={{ position: 'absolute', right: 13, bottom: 13, fontSize: '0.6rem', color: '#1e3a29', userSelect: 'none' }}>⌥⏎</div>
              </div>
              <button onClick={() => send(input)} disabled={!input.trim() || isTyping} className="mk-send"
                style={{
                  width: 48, height: 48, borderRadius: 13, border: '1.5px solid rgba(74,222,128,0.15)', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  background: input.trim() && !isTyping ? 'linear-gradient(135deg,#16a34a,#059669)' : 'rgba(8,16,10,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: input.trim() && !isTyping ? '0 4px 14px rgba(22,163,74,0.35)' : 'none',
                  opacity: !input.trim() || isTyping ? 0.38 : 1, flexShrink: 0, transition: 'all 0.18s',
                }}>
                {isTyping
                  ? <span style={{ color: '#4ade80', fontSize: 18, display: 'inline-block', animation: 'mkBounce 1s infinite' }}>⟳</span>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                }
              </button>
            </div>
            <div style={{ marginTop: 7, fontSize: '0.62rem', color: '#1e3a29', textAlign: 'center' }}>{FOOTER_HINT[uiLang]}</div>
          </div>
        </div>

      </div>
    </>
  );
}
