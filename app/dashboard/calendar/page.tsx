'use client';

const CALENDAR: Record<string, any[]> = {
  Cotton: [
    { region: "Vidarbha", sowing: "June 1–30", flowering: "Aug–Sep", harvesting: "Oct–Jan", tips: "BT hybrid seeds. Pink bollworm monitoring from Aug." },
    { region: "Marathwada", sowing: "June 15–July 15", flowering: "Aug–Sep", harvesting: "Nov–Jan", tips: "Regular scouting. Irrigation at boll formation." },
  ],
  Soybean: [
    { region: "Marathwada", sowing: "June 15–July 15", flowering: "August", harvesting: "Sep–Oct", tips: "Rhizobium seed treatment. Avoid waterlogging." },
    { region: "Western MH", sowing: "June 20–July 20", flowering: "Aug–Sep", harvesting: "Oct–Nov", tips: "Seed treatment with Thiram+Carbendazim." },
  ],
  Onion: [
    { region: "Nashik (Rabi)", sowing: "Oct–Nov", transplanting: "December", harvesting: "Mar–Apr", tips: "Lasalgaon market monitoring. Ventilated storage." },
    { region: "Pune (Kharif)", sowing: "May–Jun", transplanting: "Jul–Aug", harvesting: "Oct–Nov", tips: "Avoid excess irrigation before harvest." },
  ],
  Grapes: [
    { region: "Nashik / Sangli", pruning: "October (Kanda Chhatayi)", flowering: "Dec–Jan", harvesting: "Jan–Mar", tips: "Pre-harvest gibberellin for berry size. Export grading." },
  ],
  Sugarcane: [
    { region: "Kolhapur / Pune", planting: "Feb–Mar", mid_term: "Jun–Aug", harvesting: "Nov–Mar", tips: "Drip irrigation saves 40% water. Ratoon crop available." },
    { region: "Marathwada", planting: "Mar–Apr", mid_term: "Jul–Sep", harvesting: "Dec–Mar", tips: "FRP price fixation. Factory selection important." },
  ],
  Wheat: [
    { region: "Western Maharashtra", sowing: "Nov 1–30", tillering: "Dec–Jan", harvesting: "Feb–Mar", tips: "Certified seed. Crown root initiation irrigation critical." },
    { region: "North MH (Jalgaon)", sowing: "Nov 15–Dec 15", tillering: "Jan", harvesting: "Mar", tips: "Durum wheat for pasta export market." },
  ],
  Banana: [
    { region: "Jalgaon (Grand Naine)", planting: "Jun–Jul or Jan–Feb", bunch_shooting: "8–10 months", harvesting: "10–12 months", tips: "Drip fertigation. Wind breakers essential. Export quality." },
  ],
  Pomegranate: [
    { region: "Solapur / Nashik", planting: "June–July", stress: "Nov (Hasta Bahar)", harvesting: "Apr–May", tips: "Drip irrigation. Bahar treatment for 2 crops/year." },
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CalendarPage() {
  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>📅 Maharashtra Crop Calendar</h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Season-wise crop schedule for all major Maharashtra crops by region</p>
      </div>

      {/* Month header */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {MONTHS.map((m, i) => (
            <div key={m} style={{ textAlign: 'center', fontSize: '0.72rem', color: i >= 5 && i <= 9 ? '#22c55e' : '#6b7280', fontWeight: i >= 5 && i <= 9 ? 600 : 400, padding: '0.25rem 0', background: i >= 5 && i <= 9 ? 'rgba(34,197,94,0.06)' : 'transparent', borderRadius: '0.25rem' }}>
              {m}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '2px' }}></span>Kharif Season (Jun–Oct)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></span>Rabi Season (Nov–Mar)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }}></span>Summer Crop</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(CALENDAR).map(([crop, regions]) => (
          <div key={crop} className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem' }}>🌾 {crop}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {regions.map((r, i) => (
                <div key={i} style={{ padding: '0.85rem', background: 'rgba(34,197,94,0.04)', borderRadius: '0.6rem', border: '1px solid rgba(34,197,94,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8d0' }}>📍 {r.region}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', background: 'rgba(34,197,94,0.06)', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>
                      💡 {r.tips}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {Object.entries(r).filter(([k]) => k !== 'region' && k !== 'tips').map(([phase, dates]) => (
                      <div key={phase} style={{ background: phase === 'harvesting' || phase === 'harvested' ? 'rgba(34,197,94,0.15)' : phase === 'sowing' || phase === 'planting' || phase === 'pruning' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)', borderRadius: '0.4rem', padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: '#e2e8d0' }}>
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{phase}: </span>{String(dates)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
