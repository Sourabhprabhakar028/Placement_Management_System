import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { placementAPI, studentAPI, companyAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import Chip from '../components/ui/Chip'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { TrendingUp, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = ['PLACED','OFFER_ACCEPTED','OFFER_DECLINED']

const ctcColor = (v) => {
  if (v >= 20) return '#3CDFA0'
  if (v >= 10) return '#6AA8FF'
  return '#F5C063'
}

export default function Placements() {
  const { isAdmin } = useAuth()
  const [placements, setPlacements]     = useState([])
  const [students, setStudents]         = useState([])
  const [companies, setCompanies]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [showAdd, setShowAdd]           = useState(false)
  const [editP, setEditP]               = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, sRes, cRes] = await Promise.all([
        placementAPI.getAll(),
        studentAPI.getAll({size:200}),
        companyAPI.getAll(),
      ])
      setPlacements(pRes.data?.content ?? pRes.data)
      const sd = sRes.data?.content ?? sRes.data
      setStudents(Array.isArray(sd)?sd:[])
      setCompanies(cRes.data?.content ?? cRes.data)
    } catch { toast.error('Failed to load placements') }
    finally { setLoading(false) }
  },[])

  useEffect(()=>{ load() },[load])

  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await placementAPI.create({ ...data, ctcOffered: Number(data.ctcOffered) })
      toast.success('Placement recorded! 🎉')
      setShowAdd(false); reset(); load()
    } catch(e){ toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try {
      await placementAPI.update(editP.id, { ...data, ctcOffered: Number(data.ctcOffered) })
      toast.success('Placement updated!')
      setEditP(null); load()
    } catch(e){ toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await placementAPI.delete(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Failed') }
  }

  const avgCTC = placements.length
    ? (placements.reduce((s,p)=>s+(p.ctcOffered||0),0)/placements.length).toFixed(1)
    : 0
  const maxCTC = placements.length ? Math.max(...placements.map(p=>p.ctcOffered||0)) : 0

  const PlacementForm = ({onSubmit,defaultValues,loading:l}) => {
    const {register:r,handleSubmit:h}=useForm({defaultValues})
    return (
      <form onSubmit={h(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Student</label>
          <select className="inp" {...r('studentId',{required:true})}>
            <option value="">Select student</option>
            {students.map(s=><option key={s.id} value={s.id}>{s.name} – {s.branch}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Company</label>
          <select className="inp" {...r('companyId',{required:true})}>
            <option value="">Select company</option>
            {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">CTC (LPA)</label>
            <input className="inp" type="number" step="0.1" min="0" placeholder="12.5" {...r('ctcOffered',{required:true})}/>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Placed date</label>
            <input className="inp" type="date" {...r('placedDate',{required:true})}/>
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Status</label>
          <select className="inp" {...r('status')}>
            {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <button type="submit" disabled={l} className="w-full py-2.5 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h disabled:opacity-60">
          {l?'Saving...':'Record placement'}
        </button>
      </form>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Placements" subtitle={`${placements.length} records`}/>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 page-in">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:'Total placed', value: placements.length, color:'#3CDFA0' },
            { label:'Avg CTC',      value: `₹${avgCTC}L`,    color:'#6AA8FF' },
            { label:'Highest CTC',  value: `₹${maxCTC}L`,    color:'#A68CF8' },
          ].map(({label,value,color})=>(
            <div key={label} className="bg-bg-1 border border-line rounded-xl px-4 py-4">
              <p className="text-[9px] font-semibold text-t-3 tracking-widest uppercase mb-1.5">{label}</p>
              <p className="text-2xl font-bold font-mono" style={{color}}>{value}</p>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="flex justify-end">
            <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus size={12}/>Record placement</button>
          </div>
        )}

        <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">
          {loading ? <PageSpinner/> : placements.length===0 ? (
            <EmptyState icon={TrendingUp} title="No placements recorded yet"
              action={isAdmin&&<button onClick={()=>setShowAdd(true)} className="btn-primary mx-auto"><Plus size={12}/>Record</button>}/>
          ) : (
            <table className="tbl">
              <thead><tr>
                <th>Student</th><th>Branch</th><th>Company</th><th>CTC (LPA)</th><th>Date</th><th>Status</th>
                {isAdmin&&<th>Actions</th>}
              </tr></thead>
              <tbody>
                {placements.map(p=>{
                  const initials = p.student?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?'
                  const colors=['#3D7EFF','#19C97A','#F5A623','#FF4D6D','#8B5CF6','#0CC8B8']
                  const col = colors[(p.student?.name||'').charCodeAt(0)%colors.length]
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{background:col}}>{initials}</div>
                          <p className="text-xs font-semibold text-t-1">{p.student?.name||'—'}</p>
                        </div>
                      </td>
                      <td><span className="text-[10px] font-mono text-t-2">{p.student?.branch}</span></td>
                      <td><span className="text-xs font-semibold text-t-1">{p.company?.name||'—'}</span></td>
                      <td>
                        <span className="text-sm font-bold font-mono" style={{color:ctcColor(p.ctcOffered)}}>
                          ₹{p.ctcOffered}L
                        </span>
                      </td>
                      <td><span className="text-[10px] font-mono text-t-3">{p.placedDate||'—'}</span></td>
                      <td><Chip label={p.status}/></td>
                      {isAdmin&&(
                        <td>
                          <div className="flex gap-1.5">
                            <button onClick={()=>setEditP(p)} className="btn-ghost"><Pencil size={11}/></button>
                            <button onClick={()=>setDeleteTarget(p)} className="btn-ghost hover:!border-accent-rose hover:!text-accent-rose"><Trash2 size={11}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={showAdd} onClose={()=>{setShowAdd(false);reset()}} title="Record Placement">
        <PlacementForm onSubmit={handleAdd} loading={saving} defaultValues={{status:'PLACED'}}/>
      </Modal>
      <Modal open={!!editP} onClose={()=>setEditP(null)} title="Edit Placement">
        {editP&&<PlacementForm onSubmit={handleEdit} loading={saving} defaultValues={{
          ...editP, studentId:editP.student?.id, companyId:editP.company?.id
        }}/>}
      </Modal>
      <Modal open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} title="Confirm Delete" width="max-w-sm">
        {deleteTarget&&(
          <div>
            <p className="text-sm text-t-2 mb-5">Delete this placement record?</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-accent-rose rounded-lg text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
