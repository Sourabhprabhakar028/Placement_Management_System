import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { applicationAPI, placementAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import Chip from '../components/ui/Chip'
import { TrendingUp, FileText, CheckCircle } from 'lucide-react'

export default function StudentPortal() {
  const { user } = useAuth()
  const [apps, setApps]   = useState([])
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)

  const name = user?.email?.split('@')[0] || 'Student'

  useEffect(() => {
    Promise.all([
      applicationAPI.getAll().catch(() => ({ data: [] })),
      placementAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([aRes, pRes]) => {
      setApps(aRes.data?.content ?? aRes.data ?? [])
      const placements = pRes.data?.content ?? pRes.data ?? []
      setPlace(placements[0] || null)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <><Topbar title="My Portal" /><PageSpinner /></>

  return (
    <div className="flex flex-col h-full">
      <Topbar title="My Portal" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5 page-in">

        <div>
          <p className="text-xl font-bold tracking-tight">
            Welcome, <span className="text-blue-h capitalize">{name}</span> 👋
          </p>
          <p className="text-xs text-t-3 mt-1">Track your applications and placement status here.</p>
        </div>

        {/* Placement status */}
        <div className={`rounded-xl border p-5 ${place ? 'bg-accent-green/5 border-accent-green/30' : 'bg-bg-1 border-line'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${place ? 'bg-accent-green/15' : 'bg-bg-3'}`}>
              {place ? <CheckCircle size={18} className="text-accent-green" /> : <TrendingUp size={18} className="text-t-3" />}
            </div>
            <div>
              <p className="text-sm font-bold">{place ? `🎉 Placed at ${place.company?.name}!` : 'Not yet placed'}</p>
              {place && <p className="text-xs text-accent-green font-mono mt-0.5">CTC: ₹{place.ctcOffered}L · {place.placedDate}</p>}
              {!place && <p className="text-xs text-t-3 mt-0.5">Keep applying — your placement is on its way!</p>}
            </div>
          </div>
        </div>

        {/* Applications */}
        <div>
          <p className="sec-heading">My Applications ({apps.length})</p>
          <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">
            {apps.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={24} className="text-t-3 mx-auto mb-3" />
                <p className="text-sm text-t-2">No applications yet</p>
                <p className="text-xs text-t-3 mt-1">Browse companies and apply to get started.</p>
              </div>
            ) : (
              <table className="tbl">
                <thead><tr><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
                <tbody>
                  {apps.map(a => (
                    <tr key={a.id}>
                      <td>
                        <p className="text-xs font-semibold text-t-1">{a.company?.name}</p>
                        <p className="text-[10px] text-t-3">{a.company?.location}</p>
                      </td>
                      <td><span className="text-[10px] font-mono text-t-3">{a.appliedDate || '—'}</span></td>
                      <td><Chip label={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
