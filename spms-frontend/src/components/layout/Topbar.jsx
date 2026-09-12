import { useNavigate } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import dayjs from 'dayjs'

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'SP'

  return (
    <header className="h-[54px] px-6 flex items-center justify-between border-b border-line bg-bg-1 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <>
            <div className="w-px h-4 bg-line-2" />
            <span className="text-[11px] text-t-3">{subtitle}</span>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-t-3 mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block animate-pulse" />
          {dayjs().format('ddd, D MMM YYYY')}
        </div>

        {/* Search icon */}
        <button className="ic-btn" title="Search">
          <Search size={14} />
        </button>

        {/* Notifications */}
        <button className="ic-btn relative" title="Notifications">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-rose border border-bg-1" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-[11px] font-bold text-white cursor-pointer hover:ring-2 hover:ring-blue/40 transition-all duration-150"
          title="Profile"
        >
          {initials}
        </button>
      </div>
    </header>
  )
}
