// Reusable stat card used on Dashboard, Students, etc.
export default function StatCard({ label, value, delta, deltaPositive, icon: Icon, color = '#3D7EFF', spark = [] }) {
  const softColor = `${color}18`

  return (
    <div className="stat-card">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: color }} />

      {/* Head row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ background: softColor, color }}
        >
          {Icon && <Icon size={16} strokeWidth={1.8} />}
        </div>
        {delta !== undefined && (
          <span
            className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full"
            style={{
              background: deltaPositive ? 'rgba(25,201,122,0.12)' : 'rgba(255,77,109,0.12)',
              color:       deltaPositive ? '#3CDFA0' : '#FF7A90',
            }}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Label + Value */}
      <p className="text-[9px] font-semibold text-t-3 tracking-widest uppercase mb-1">{label}</p>
      <p className="text-3xl font-bold font-mono tracking-tight leading-none" style={{ color }}>
        {value}
      </p>

      {/* Sparkline */}
      {spark.length > 0 && (
        <div className="flex items-end gap-0.5 h-7 mt-3">
          {spark.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background: color,
                opacity: 0.3 + (i / spark.length) * 0.7,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
