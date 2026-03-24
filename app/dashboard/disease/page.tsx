'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

interface TreatmentData {
  immediate: string[];
  spray_schedule: string;
  organic: string;
  chemical: string;
}

interface Detection {
  disease: string;
  confidence: number;
  severity: string;
  icon: string;
  cause: string;
  spread: string;
  symptoms_matched: string[];
  treatment: TreatmentData;
  prevention: string[];
  lab_action: string;
  favorable: boolean;
  weather_note?: string;
  affected_area_estimate?: string;
  stage?: string;
}

interface ResultData {
  crop: string;
  district?: string;
  conditions?: { temperature: number; humidity: number };
  analysis_time: string;
  detections: Detection[];
  total_found: number;
  disclaimer: string;
  image_filename?: string;
  model?: string;
}

const CROPS = ['Cotton','Grapes','Tomato','Onion','Wheat','Soybean','Sugarcane','Potato','Garlic','Banana'];
const DISTRICTS = ['Nashik','Pune','Nagpur','Aurangabad','Solapur','Amravati','Latur','Jalgaon','Kolhapur','Sangli','Akola','Yavatmal','Nanded'];
const SEASONS = ['Kharif','Rabi','Zaid'];
const COMMON_SYMPTOMS = [
  'yellow leaves','holes in leaves','white powder on leaves','brown spots',
  'leaf curl','wilting','stunted growth','rust colored powder',
  'boll damage','striped leaves','sticky honeydew','root rot',
];

function SeverityBadge({ severity }: { severity: string }) {
  const cls = severity === 'high'
    ? 'bg-red-900/60 text-red-300 border-red-700/50'
    : severity === 'medium'
    ? 'bg-amber-900/60 text-amber-300 border-amber-700/50'
    : 'bg-green-900/60 text-green-300 border-green-700/50';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${cls} uppercase tracking-wide`}>
      {severity === 'high' ? '🔴 High Risk' : severity === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk'}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-white w-10 text-right">{pct}%</span>
    </div>
  );
}

function DetectionCard({ d, index }: { d: Detection; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  return (
    <div className={`rounded-2xl border overflow-hidden ${
      index === 0 ? 'border-red-500/40 bg-red-950/20' : 'border-gray-700/50 bg-gray-800/40'
    }`}>
      {/* Header */}
      <div className="p-4 flex items-start justify-between cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{d.icon}</div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-bold text-base">{d.disease}</h3>
              {index === 0 && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">Primary Match</span>}
              {d.stage && <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{d.stage} Stage</span>}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <SeverityBadge severity={d.severity} />
              {d.affected_area_estimate && (
                <span className="text-xs text-gray-400">Area: {d.affected_area_estimate}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-xs text-gray-400 mb-1">AI Confidence</div>
          <div className="w-32"><ConfidenceBar value={d.confidence} /></div>
          <div className="text-gray-500 text-xs mt-2">{expanded ? '▲ Less' : '▼ More'}</div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-700/30 pt-4">
          {/* Weather note */}
          {d.weather_note && (
            <div className={`p-2 rounded-lg text-xs ${d.favorable ? 'bg-red-900/30 text-red-300 border border-red-700/30' : 'bg-green-900/30 text-green-300 border border-green-700/30'}`}>
              {d.weather_note}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left col */}
            <div className="space-y-3">
              <div>
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">🦠 Cause</h4>
                <p className="text-gray-200 text-sm">{d.cause}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">📡 How it spreads</h4>
                <p className="text-gray-200 text-sm">{d.spread}</p>
              </div>
              {d.symptoms_matched.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">✅ Matched symptoms</h4>
                  <div className="flex flex-wrap gap-1">
                    {d.symptoms_matched.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-red-900/40 border border-red-700/40 text-red-300 rounded-full text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right col — Treatment */}
            <div>
              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">💊 Treatment Protocol</h4>
              <div className="space-y-2">
                {d.treatment.immediate?.length > 0 && (
                  <div className="p-2 bg-red-900/20 border border-red-700/30 rounded-lg">
                    <div className="text-red-400 text-xs font-bold mb-1">🚨 Immediate Actions</div>
                    {d.treatment.immediate.map((t, i) => (
                      <div key={i} className="text-sm text-gray-200 flex gap-1 mb-0.5">
                        <span className="text-red-400 flex-shrink-0">{i + 1}.</span> {t}
                      </div>
                    ))}
                  </div>
                )}
                {d.treatment.chemical && (
                  <div className="p-2 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <div className="text-blue-400 text-xs font-bold mb-1">🧪 Chemical Control</div>
                    <p className="text-sm text-gray-200">{d.treatment.chemical}</p>
                  </div>
                )}
                {d.treatment.organic && (
                  <div className="p-2 bg-green-900/20 border border-green-700/30 rounded-lg">
                    <div className="text-green-400 text-xs font-bold mb-1">🌿 Organic Option</div>
                    <p className="text-sm text-gray-200">{d.treatment.organic}</p>
                  </div>
                )}
                {d.treatment.spray_schedule && (
                  <div className="p-2 bg-gray-800/60 rounded-lg">
                    <div className="text-gray-400 text-xs font-bold mb-1">📅 Spray Schedule</div>
                    <p className="text-sm text-gray-200">{d.treatment.spray_schedule}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prevention */}
          <div>
            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">🛡️ Prevention</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {d.prevention.map((p, i) => (
                <div key={i} className="flex gap-2 text-sm text-gray-200 bg-gray-800/40 rounded p-1.5">
                  <span className="text-green-400 flex-shrink-0">✓</span> {p}
                </div>
              ))}
            </div>
          </div>

          {/* Lab action */}
          <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-xl flex gap-3 items-start">
            <span className="text-xl">🧪</span>
            <div>
              <div className="text-purple-300 text-xs font-bold mb-0.5">Lab / Expert Action Required</div>
              <p className="text-gray-200 text-sm">{d.lab_action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiseasePage() {
  const [mode, setMode] = useState<'symptom' | 'image'>('symptom');
  const [crop, setCrop] = useState('Cotton');
  const [symptoms, setSymptoms] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [season, setSeason] = useState('Kharif');
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(65);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState('');

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => {
      const parts = prev.split(',').map(x => x.trim()).filter(Boolean);
      if (parts.includes(s)) return parts.filter(x => x !== s).join(', ');
      return [...parts, s].join(', ');
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const analyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let data: ResultData;
      if (mode === 'image' && imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('crop', crop);
        fd.append('district', district);
        fd.append('temperature', temperature.toString());
        fd.append('humidity', humidity.toString());
        const r = await fetch(`${API}/disease/detect-image`, { method: 'POST', body: fd });
        if (!r.ok) throw new Error(await r.text());
        data = await r.json();
      } else {
        const r = await fetch(`${API}/disease/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop, symptoms, district, season, temperature, humidity }),
        });
        if (!r.ok) throw new Error(await r.text());
        data = await r.json();
      }
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-12">
      {/* Header */}
      <div className="bg-gray-900/95 border-b border-gray-800 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-xl">🔬</div>
            <div>
              <h1 className="text-white font-bold text-xl">AI Disease Detection</h1>
              <p className="text-gray-400 text-sm">Symptom-based & image crop disease analysis for Maharashtra farms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Mode switch */}
            <div className="flex bg-gray-800 rounded-xl p-1 gap-1">
              {(['symptom', 'image'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                  {m === 'symptom' ? '📝 Symptoms' : '📷 Image'}
                </button>
              ))}
            </div>

            {/* Crop + location */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-white font-semibold text-sm">Crop & Location</h3>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Crop *</label>
                <select value={crop} onChange={e => setCrop(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                  {CROPS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">District</label>
                  <select value={district} onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Season</label>
                  <select value={season} onChange={e => setSeason(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                    {SEASONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {/* Weather conditions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Temp (°C): <span className="text-white">{temperature}</span></label>
                  <input type="range" min={15} max={45} value={temperature} onChange={e => setTemperature(+e.target.value)}
                    className="w-full accent-red-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Humidity %: <span className="text-white">{humidity}</span></label>
                  <input type="range" min={20} max={100} value={humidity} onChange={e => setHumidity(+e.target.value)}
                    className="w-full accent-red-500" />
                </div>
              </div>
            </div>

            {/* Symptoms or Image */}
            {mode === 'symptom' ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Describe Symptoms</h3>
                <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3}
                  placeholder="Describe what you see on the plant... e.g. yellow leaves, holes in bolls, white powder"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-red-500" />
                <div>
                  <p className="text-xs text-gray-400 mb-2">Quick select symptoms:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SYMPTOMS.map(s => {
                      const active = symptoms.includes(s);
                      return (
                        <button key={s} onClick={() => toggleSymptom(s)}
                          className={`px-2 py-1 rounded-full text-xs transition-all border ${active ? 'bg-red-600/30 border-red-500/60 text-red-300' : 'border-gray-700 text-gray-400 hover:border-red-600/40 hover:text-gray-200'}`}>
                          {active ? '✓ ' : ''}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Upload Plant Image</h3>
                <label className="block cursor-pointer">
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${imagePreview ? 'border-red-500/40' : 'border-gray-700 hover:border-red-600/40'}`}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-400 text-sm">Click to upload plant/leaf image</p>
                        <p className="text-gray-600 text-xs mt-1">JPG, PNG, WEBP • Max 10MB</p>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imageFile && (
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="text-green-400">✓</span> {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                    <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-red-400 hover:text-red-300 ml-auto">Remove</button>
                  </div>
                )}
                <p className="text-xs text-gray-500">💡 For best results: take a clear close-up photo of the affected leaf or boll in natural daylight.</p>
              </div>
            )}

            <button onClick={analyze} disabled={loading || (mode === 'image' && !imageFile)}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-900/40 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>🔬 {mode === 'image' ? 'Analyze Image' : 'Detect Diseases'}</>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm">{error}</div>
            )}
          </div>

          {/* Results panel */}
          <div className="lg:col-span-3">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-gray-400 text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-gray-600 text-sm max-w-sm">Select your crop, describe symptoms or upload a plant photo, then click Detect to get an AI-powered disease analysis with treatment protocols.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin mb-4" />
                <p className="text-gray-400">Running disease analysis...</p>
                <p className="text-gray-600 text-xs mt-1">Checking symptom patterns, weather conditions, disease database</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Analysis summary */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-white font-bold">Analysis: {result.crop}</div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        {result.district && `📍 ${result.district} • `}
                        {result.conditions && `🌡️ ${result.conditions.temperature}°C, ${result.conditions.humidity}% humidity • `}
                        🕐 {new Date(result.analysis_time).toLocaleTimeString('en-IN')}
                      </div>
                      {result.model && <div className="text-gray-600 text-xs mt-0.5">Model: {result.model}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600/20 text-red-300 border border-red-700/40 px-3 py-1 rounded-full text-sm font-bold">
                        {result.total_found} disease{result.total_found !== 1 ? 's' : ''} identified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detections */}
                {result.detections.length > 0 ? (
                  result.detections.map((d, i) => <DetectionCard key={i} d={d} index={i} />)
                ) : (
                  <div className="bg-green-900/20 border border-green-700/40 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-green-300 font-bold">No diseases detected</div>
                    <p className="text-gray-400 text-sm mt-1">Your crop appears healthy based on the symptoms provided. Continue regular field monitoring.</p>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="p-3 bg-gray-800/50 border border-gray-700/30 rounded-xl text-xs text-gray-500">
                  ⚠️ {result.disclaimer}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
