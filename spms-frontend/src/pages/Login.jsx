import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const STATS = [
  { value: '248', label: 'Students' },
  { value: '42',  label: 'Companies' },
  { value: '75%', label: 'Placed' },
]

const COLORS = ['#3D7EFF', '#19C97A', '#F5A623']

export default function Login() {
  const { login, loading } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const onSubmit = ({ email, password }) => login(email, password)

  const fillDemo = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@placement.com')
      setValue('password', 'Admin@1234')
    } else {
      setValue('email', 'student@placement.com')
      setValue('password', 'Student@1234')
    }
  }

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: '1.05fr .95fr' }}>

      {/* ── Left hero panel ── */}
      <div className="bg-bg-1 border-r border-line relative overflow-hidden flex flex-col justify-between p-10">
        {/* Decorative geometry */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="rg1" cx="75%" cy="25%">
              <stop offset="0%" stopColor="#3D7EFF" stopOpacity=".14" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="rg2" cx="15%" cy="80%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity=".09" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="75%" cy="20%" r="300" fill="url(#rg1)" />
          <circle cx="10%" cy="85%" r="220" fill="url(#rg2)" />
          {[160, 320, 480].map(y => (
            <line key={y} x1="0" y1={y} x2="100%" y2={y} stroke="rgba(255,255,255,.03)" strokeWidth="1" />
          ))}
          {['25%', '50%', '75%'].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="100%" stroke="rgba(255,255,255,.03)" strokeWidth="1" />
          ))}
          {/* Floating dots */}
          <circle cx="35%" cy="38%" r="3" fill="rgba(61,126,255,.5)" />
          <circle cx="70%" cy="62%" r="2" fill="rgba(139,92,246,.4)" />
          <circle cx="20%" cy="55%" r="2" fill="rgba(61,126,255,.35)" />
          <circle cx="80%" cy="30%" r="2.5" fill="rgba(25,201,122,.4)" />
        </svg>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue flex items-center justify-center font-bold text-base text-white relative overflow-hidden">
            S
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">SPMS</div>
            <div className="text-[9px] text-t-3 font-mono tracking-widest mt-0.5">placement · v1.0</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-h tracking-[.12em] uppercase mb-5">
            <div className="w-5 h-0.5 bg-blue rounded" />
            Smart Placement
          </div>
          <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-t-1 mb-4">
            Every placement,<br />managed with<br />
            <em className="not-italic text-blue-h">precision.</em>
          </h1>
          <p className="text-xs text-t-3 leading-7 max-w-xs">
            One secure platform for students, companies, interviews, and placement records — built for officers who move fast.
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="bg-bg-2 border border-line rounded-xl p-4 text-center"
                style={{ borderTop: `2px solid ${COLORS[i]}` }}
              >
                <div className="text-2xl font-bold font-mono tracking-tight">{s.value}</div>
                <div className="text-[9px] font-semibold text-t-3 tracking-[.08em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-[10px] text-t-3 border-t border-line pt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          All systems operational · API on :8081
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="bg-bg-base flex flex-col justify-center px-12 py-10">
        <p className="text-[10px] font-bold text-blue-h tracking-[.12em] uppercase mb-2">Welcome back</p>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Sign in to SPMS</h2>
        <p className="text-xs text-t-3 mb-7">Enter your credentials to access the portal</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-[.1em] uppercase mb-1.5">
              Email address
            </label>
            <input
              className={`inp ${errors.email ? 'border-accent-rose' : ''}`}
              type="email"
              placeholder="admin@placement.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
              })}
            />
            {errors.email && <p className="text-[10px] text-accent-rose mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-[.1em] uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                className={`inp pr-10 ${errors.password ? 'border-accent-rose' : ''}`}
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-t-3 hover:text-t-2 transition-colors"
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-accent-rose mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember / forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-t-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-blue" />
              Keep me signed in
            </label>
            <span className="text-xs font-semibold text-blue-h cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue rounded-lg text-white text-sm font-bold tracking-tight hover:bg-blue-h transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
            ) : (
              <>Sign in to SPMS <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        {/* Demo shortcuts */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-line" />
          <span className="text-[10px] text-t-3 uppercase tracking-wider">or sign in as</span>
          <div className="flex-1 h-px bg-line" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['admin', 'student'].map(role => (
            <button
              key={role}
              type="button"
              onClick={() => fillDemo(role)}
              className="py-2.5 bg-bg-2 border border-line-2 rounded-lg text-t-2 text-xs font-semibold hover:border-blue hover:text-blue-h hover:bg-blue/5 transition-all duration-150 capitalize"
            >
              {role} demo
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-t-3 mt-5">
          New to SPMS?{' '}
          <Link to="/register" className="text-blue-h font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
