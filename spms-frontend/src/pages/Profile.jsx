import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Topbar from '../components/layout/Topbar'
import { User, Lock, Bell, LogOut } from 'lucide-react'

export default function Profile() {
  const { user, isAdmin, logout, changePassword } = useAuth()
  const [tab, setTab] = useState('info')
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const initials = user?.email?.slice(0,2).toUpperCase() || 'SP'
  const name     = user?.email?.split('@')[0] || 'User'

  const onChangePwd = async ({ currentPassword, newPassword, confirm }) => {
    if (newPassword !== confirm) { toast.error('Passwords do not match'); return }
    setSaving(true)
    try { await changePassword(currentPassword, newPassword); reset() }
    catch (e) { toast.error(e.response?.data?.error || 'Failed to update password') }
    finally { setSaving(false) }
  }

  const TABS = [
    { key:'info', label:'Account info',      icon: User  },
    { key:'pwd',  label:'Change password',   icon: Lock  },
    { key:'notif',label:'Notifications',     icon: Bell  },
  ]

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Profile & Settings" />
      <div className="flex-1 overflow-y-auto p-6 page-in">
        <div className="grid gap-4" style={{ gridTemplateColumns: '200px 1fr' }}>

          {/* Side panel */}
          <div className="space-y-3">
            <div className="bg-bg-1 border border-line rounded-xl p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-blue flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 relative">
                {initials}
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-accent-green rounded-full border-2 border-bg-1" />
              </div>
              <p className="text-sm font-bold capitalize">{name}</p>
              <span className="inline-flex px-2.5 py-1 mt-1.5 rounded-full text-[9px] font-bold font-mono"
                style={{ background:'rgba(61,126,255,.12)', color:'#5591FF' }}>
                {isAdmin ? 'Administrator' : 'Student'}
              </span>
            </div>

            <div className="bg-bg-1 border border-line rounded-xl p-2 space-y-0.5">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${tab===key ? 'bg-blue/10 text-blue-h' : 'text-t-3 hover:bg-bg-3 hover:text-t-2'}`}>
                  <Icon size={13} /> {label}
                </button>
              ))}
              <button onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-accent-rose hover:bg-rose-500/10 transition-all duration-150 mt-1">
                <LogOut size={13} /> Sign out
              </button>
            </div>
          </div>

          {/* Main panel */}
          <div className="bg-bg-1 border border-line rounded-xl p-6">

            {tab === 'info' && (
              <div>
                <p className="sec-heading">Account information</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { k:'Email',        v: user?.email },
                    { k:'Role',         v: isAdmin ? 'Administrator' : 'Student' },
                    { k:'Username',     v: name },
                    { k:'Member since', v: 'March 2026' },
                  ].map(({ k, v }) => (
                    <div key={k} className="bg-bg-2 border border-line rounded-lg p-3">
                      <p className="text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1">{k}</p>
                      <p className="text-xs font-semibold text-t-1">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-line mb-5"/>
                <p className="sec-heading">Session info</p>
                <div className="flex items-center gap-2 text-xs text-t-3">
                  <span className="w-2 h-2 rounded-full bg-accent-green inline-block" />
                  Active session — tokens auto-refresh every 24 hours
                </div>
              </div>
            )}

            {tab === 'pwd' && (
              <div>
                <p className="sec-heading">Change password</p>
                <form onSubmit={handleSubmit(onChangePwd)} className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Current password</label>
                    <input className="inp" type="password" placeholder="••••••••"
                      {...register('currentPassword', { required: 'Required' })} />
                    {errors.currentPassword && <p className="text-[10px] text-accent-rose mt-1">{errors.currentPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">New password</label>
                    <input className="inp" type="password" placeholder="Min 8 characters"
                      {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} />
                    {errors.newPassword && <p className="text-[10px] text-accent-rose mt-1">{errors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Confirm new password</label>
                    <input className="inp" type="password" placeholder="••••••••"
                      {...register('confirm', { required: 'Required' })} />
                  </div>
                  <button type="submit" disabled={saving}
                    className="py-2.5 px-5 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h transition-all disabled:opacity-60">
                    {saving ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'notif' && (
              <div>
                <p className="sec-heading">Notification preferences</p>
                {[
                  'Email on placement confirmation',
                  'Email on interview scheduled',
                  'Email on application status change',
                ].map(label => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                    <span className="text-xs text-t-2">{label}</span>
                    <input type="checkbox" defaultChecked className="accent-blue" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
