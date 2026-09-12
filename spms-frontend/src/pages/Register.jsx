import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Register() {
  const { register: registerUser, loading } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    registerUser({ name: data.name, email: data.email, password: data.password, role: data.role })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center font-bold text-white text-sm">S</div>
          <div>
            <div className="text-sm font-bold tracking-tight">SPMS</div>
            <div className="text-[9px] text-t-3 font-mono">Smart Placement Management</div>
          </div>
        </div>

        <div className="bg-bg-1 border border-line rounded-xl p-7">
          <p className="text-[10px] font-bold text-blue-h tracking-[.12em] uppercase mb-2">Get started</p>
          <h2 className="text-xl font-bold tracking-tight mb-1">Create your account</h2>
          <p className="text-xs text-t-3 mb-6">Join the SPMS placement portal</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[9px] font-bold text-t-3 tracking-[.1em] uppercase mb-1.5">Full name</label>
              <input className={`inp ${errors.name ? 'border-accent-rose' : ''}`} placeholder="Sourabh Prabhakar"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
              {errors.name && <p className="text-[10px] text-accent-rose mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[9px] font-bold text-t-3 tracking-[.1em] uppercase mb-1.5">Email address</label>
              <input className={`inp ${errors.email ? 'border-accent-rose' : ''}`} type="email" placeholder="you@example.com"
                {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} />
              {errors.email && <p className="text-[10px] text-accent-rose mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[9px] font-bold text-t-3 tracking-[.1em] uppercase mb-1.5">Password</label>
              <div className="relative">
                <input className={`inp pr-10 ${errors.password ? 'border-accent-rose' : ''}`}
                  type={showPwd ? 'text' : 'password'} placeholder="Min 8 characters"
                  {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-t-3 hover:text-t-2">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-accent-rose mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-[9px] font-bold text-t-3 tracking-[.1em] uppercase mb-1.5">Role</label>
              <select className="inp" {...register('role', { required: true })}>
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                </svg>
              ) : (<>Create account <ArrowRight size={14} /></>)}
            </button>
          </form>

          <p className="text-center text-xs text-t-3 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-h font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
