import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,8,15,0.80)' }}
      onClick={onClose}
    >
      <div
        className={`w-full ${width} bg-bg-2 border border-line-2 rounded-xl shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'pageIn .2s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="text-sm font-bold tracking-tight">{title}</h2>
          <button onClick={onClose} className="ic-btn">
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
