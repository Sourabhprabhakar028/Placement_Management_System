export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-bg-3 border border-line flex items-center justify-center mb-4 text-t-3">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <p className="text-sm font-semibold text-t-2 mb-1">{title}</p>
      {desc && <p className="text-xs text-t-3 mb-4 max-w-xs">{desc}</p>}
      {action}
    </div>
  )
}
