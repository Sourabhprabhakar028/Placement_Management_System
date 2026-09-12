import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Building2, FileText,
  Clock, TrendingUp, BarChart3, Download,
  FileCheck, Image, Mail, LogOut, User,
  BookOpen, ChevronRight,
} from 'lucide-react'

const ADMIN_NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard',    to: '/dashboard',    icon: LayoutDashboard },
    ],
  },
  {
    section: 'Management',
    items: [
      { label: 'Students',     to: '/students',     icon: Users },
      { label: 'Companies',    to: '/companies',    icon: Building2 },
      { label: 'Applications', to: '/applications', icon: FileText,  badge: null },
      { label: 'Interviews',   to: '/interviews',   icon: Clock },
      { label: 'Placements',   to: '/placements',   icon: TrendingUp },
    ],
  },
  {
    section: 'Reports',
    items: [
      { label: 'Analytics',    to: '/reports',      icon: BarChart3 },
      { label: 'Export Data',  to: '/export',       icon: Download },
    ],
  },
  {
    section: 'Files',
    items: [
      { label: 'Resumes',       to: '/resumes',       icon: FileCheck },
      { label: 'Offer Letters', to: '/offer-letters', icon: Mail },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Profile',      to: '/profile',      icon: User },
    ],
  },
]

const STUDENT_NAV = [
  {
    section: 'My Portal',
    items: [
      { label: 'My Dashboard',   to: '/student-portal', icon: LayoutDashboard },
      { label: 'Browse Jobs',    to: '/companies',      icon: Building2 },
      { label: 'My Applications',to: '/applications',   icon: FileText },
      { label: 'Interview Rounds',to: '/interviews',    icon: Clock },
      { label: 'My Placement',   to: '/placements',     icon: TrendingUp },
    ],
  },
  {
    section: 'Documents',
    items: [
      { label: 'My Resume',     to: '/resumes',     icon: BookOpen },
      { label: 'Offer Letter',  to: '/offer-letters', icon: Mail },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Profile',       to: '/profile',     icon: User },
    ],
  },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const navConfig = isAdmin ? ADMIN_NAV : STUDENT_NAV

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'SP'

  return (
    <aside className="w-[230px] flex-shrink-0 bg-bg-1 border-r border-line flex flex-col h-screen sticky top-0">
      {/* ── Brand ── */}
      <div className="px-4 py-5 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative overflow-hidden">
            S
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[10px]" />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight text-t-1">SPMS</div>
            <div className="text-[9px] text-t-3 font-mono tracking-wide mt-0.5">
              {isAdmin ? 'admin portal' : 'student portal'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-0.5">
        {navConfig.map((group) => (
          <div key={group.section}>
            <p className="text-[9px] font-semibold text-t-4 tracking-[0.12em] uppercase px-2 py-2.5 mt-2 first:mt-0">
              {group.section}
            </p>
            {group.items.map(({ label, to, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} strokeWidth={1.8} />
                </div>
                <span className="flex-1">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="bg-accent-rose text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full font-mono">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div className="border-t border-line p-3">
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 bg-bg-3 border border-line-2 rounded-lg cursor-pointer hover:border-line-3 transition-all duration-150 group"
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-t-1 truncate">
              {user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-[9px] text-t-3 font-mono">
              {isAdmin ? 'administrator' : 'student'}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); logout() }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-t-3 hover:text-accent-rose"
            title="Sign out"
          >
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </aside>
  )
}
