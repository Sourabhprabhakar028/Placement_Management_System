import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { interviewAPI, applicationAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import Chip from '../components/ui/Chip'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { Clock, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROUND_TYPES = ['APTITUDE','TECHNICAL','HR','GROUP_DISCUSSION']
const RESULTS     = ['PENDING','PASS','FAIL']

export default function Interviews() {
  const { isAdmin } = useAuth()
  const [rounds, setRounds]             = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [showAdd, setShowAdd]           = useState(false)
  const [editRound, setEditRound]       = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [rRes, aRes] = await Promise.all([
        interviewAPI.getAll(),
        applicationAPI.getAll(),
      ])
      setRounds(rRes.data?.content ?? rRes.data)
      setApplications(aRes.data?.content ?? aRes.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  },[])

  useEffect(()=>{ load() },[load])

  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await interviewAPI.create({ ...data, roundNumber: Number(data.roundNumber) })
      toast.success('Interview round scheduled!')
      setShowAdd(false); reset(); load()
    } catch(e){ toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try {
      await interviewAPI.update(editRound.id, { ...data, roundNumber: Number(data.roundNumber) })
      toast.success('Round updated!')
      setEditRound(null); load()
    } catch(e){ toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await interviewAPI.delete(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Failed') }
  }

  const RoundForm = ({onSubmit, defaultValues, loading:l}) => {
    const {register:r,handleSubmit:h} = useForm({defaultValues})
    return (
      <form onSubmit={h(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Application</label>
          <select className="inp" {...r('applicationId',{required:true})}>
            <option value="">Select application</option>
            {applications.map(a=><option key={a.id} value={a.id}>{a.student?.name} → {a.company?.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Round #</label>
            <input className="inp" type="number" min="1" placeholder="1" {...r('roundNumber',{required:true})}/>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Round type</label>
            <select className="inp" {...r('roundType',{required:true})}>
              {ROUND_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Scheduled date</label>
            <input className="inp" type="date" {...r('scheduledDate',{required:true})}/>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Result</label>
            <select className="inp" {...r('result')}>
              {RESULTS.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Remarks</label>
          <textarea className="inp resize-none" rows={2} {...r('remarks')}/>
        </div>
        <button type="submit" disabled={l} className="w-full py-2.5 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h disabled:opacity-60">
          {l?'Saving...':'Save round'}
        </button>
      </form>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Interviews" subtitle={`${rounds.length} rounds`}/>
      <div className="flex-1 overflow-y-auto p-6 page-in">
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus size={12}/>Schedule round</button>
          </div>
        )}
        <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">
          {loading ? <PageSpinner/> : rounds.length===0 ? (
            <EmptyState icon={Clock} title="No interview rounds yet"/>
          ) : (
            <table className="tbl">
              <thead><tr>
                <th>Student</th><th>Company</th><th>Round</th><th>Type</th><th>Date</th><th>Result</th><th>Remarks</th>
                {isAdmin&&<th>Actions</th>}
              </tr></thead>
              <tbody>
                {rounds.map(r=>(
                  <tr key={r.id}>
                    <td><span className="text-xs font-semibold text-t-1">{r.jobApplication?.student?.name||'—'}</span></td>
                    <td><span className="text-xs text-t-2">{r.jobApplication?.company?.name||'—'}</span></td>
                    <td><span className="text-xs font-mono text-t-1">#{r.roundNumber}</span></td>
                    <td><Chip label={r.roundType}/></td>
                    <td><span className="text-[10px] font-mono text-t-3">{r.scheduledDate||'—'}</span></td>
                    <td><Chip label={r.result}/></td>
                    <td><span className="text-[10px] text-t-3 max-w-[120px] block truncate">{r.remarks||'—'}</span></td>
                    {isAdmin&&(
                      <td>
                        <div className="flex gap-1.5">
                          <button onClick={()=>setEditRound(r)} className="btn-ghost"><Pencil size={11}/></button>
                          <button onClick={()=>setDeleteTarget(r)} className="btn-ghost hover:!border-accent-rose hover:!text-accent-rose"><Trash2 size={11}/></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);reset()}} title="Schedule Interview Round">
        <RoundForm onSubmit={handleAdd} loading={saving} defaultValues={{result:'PENDING',roundType:'TECHNICAL',roundNumber:1}}/>
      </Modal>
      <Modal open={!!editRound} onClose={()=>setEditRound(null)} title="Edit Round">
        {editRound&&<RoundForm onSubmit={handleEdit} loading={saving} defaultValues={{
          ...editRound, applicationId: editRound.jobApplication?.id
        }}/>}
      </Modal>
      <Modal open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} title="Confirm Delete" width="max-w-sm">
        {deleteTarget&&(
          <div>
            <p className="text-sm text-t-2 mb-5">Delete this interview round?</p>
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
