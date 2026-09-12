import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { applicationAPI, studentAPI, companyAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import Chip from '../components/ui/Chip'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { FileText, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'

const STATUS_OPTIONS = ['APPLIED','SHORTLISTED','SELECTED','REJECTED']

export default function Applications() {
  const { isAdmin } = useAuth()
  const [apps, setApps]               = useState([])
  const [students, setStudents]       = useState([])
  const [companies, setCompanies]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [showAdd, setShowAdd]         = useState(false)
  const [editApp, setEditApp]         = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { register, handleSubmit, reset, formState:{errors} } = useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [appsRes, studRes, compRes] = await Promise.all([
        applicationAPI.getAll(),
        studentAPI.getAll({ size: 200 }),
        companyAPI.getAll(),
      ])
      setApps(appsRes.data?.content ?? appsRes.data)
      const sd = studRes.data?.content ?? studRes.data
      setStudents(Array.isArray(sd) ? sd : [])
      setCompanies(compRes.data?.content ?? compRes.data)
    } catch { toast.error('Failed to load applications') }
    finally { setLoading(false) }
  }, [])

  useEffect(()=>{ load() },[load])

  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await applicationAPI.create({ ...data, appliedDate: dayjs().format('YYYY-MM-DD') })
      toast.success('Application submitted!')
      setShowAdd(false); reset(); load()
    } catch (e) { toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleStatus = async (id, status) => {
    try {
      await applicationAPI.updateStatus(id, status)
      toast.success('Status updated!')
      load()
    } catch { toast.error('Failed to update status') }
  }

  const handleDelete = async () => {
    try { await applicationAPI.delete(deleteTarget.id); toast.success('Deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Applications" subtitle={`${apps.length} total`}/>
      <div className="flex-1 overflow-y-auto p-6 page-in">
        <div className="flex justify-end mb-4">
          <button onClick={()=>setShowAdd(true)} className="btn-primary"><Plus size={12}/>New application</button>
        </div>

        <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">
          {loading ? <PageSpinner/> : apps.length===0 ? (
            <EmptyState icon={FileText} title="No applications yet"
              action={<button onClick={()=>setShowAdd(true)} className="btn-primary mx-auto"><Plus size={12}/>Add</button>}/>
          ) : (
            <table className="tbl">
              <thead><tr>
                <th>Student</th><th>Company</th><th>Applied</th><th>Status</th>{isAdmin&&<th>Actions</th>}
              </tr></thead>
              <tbody>
                {apps.map(a=>(
                  <tr key={a.id}>
                    <td>
                      <p className="text-xs font-semibold text-t-1">{a.student?.name||'—'}</p>
                      <p className="text-[10px] text-t-3 font-mono">{a.student?.branch}</p>
                    </td>
                    <td>
                      <p className="text-xs font-semibold text-t-1">{a.company?.name||'—'}</p>
                      <p className="text-[10px] text-t-3">{a.company?.location}</p>
                    </td>
                    <td><span className="text-[10px] font-mono text-t-3">{a.appliedDate||'—'}</span></td>
                    <td>
                      {isAdmin ? (
                        <select
                          value={a.status}
                          onChange={e=>handleStatus(a.id,e.target.value)}
                          className="bg-bg-2 border border-line-2 rounded-md px-2 py-1 text-[10px] font-semibold font-mono outline-none cursor-pointer"
                          style={{color: a.status==='SELECTED'?'#3CDFA0': a.status==='REJECTED'?'#FF7A90': a.status==='SHORTLISTED'?'#6AA8FF':'#F5C063'}}
                        >
                          {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : <Chip label={a.status}/>}
                    </td>
                    {isAdmin&&(
                      <td>
                        <div className="flex gap-1.5">
                          <button onClick={()=>{setEditApp(a)}} className="btn-ghost"><Pencil size={11}/></button>
                          <button onClick={()=>setDeleteTarget(a)} className="btn-ghost hover:!border-accent-rose hover:!text-accent-rose"><Trash2 size={11}/></button>
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

      {/* Add Modal */}
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);reset()}} title="New Application" width="max-w-md">
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Student</label>
            <select className="inp" {...register('studentId',{required:true})}>
              <option value="">Select student</option>
              {students.map(s=><option key={s.id} value={s.id}>{s.name} – {s.branch}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Company</label>
            <select className="inp" {...register('companyId',{required:true})}>
              <option value="">Select company</option>
              {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Notes</label>
            <textarea className="inp resize-none" rows={2} placeholder="Additional notes..." {...register('notes')}/>
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h disabled:opacity-60">
            {saving?'Submitting...':'Submit application'}
          </button>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} title="Confirm Delete" width="max-w-sm">
        {deleteTarget&&(
          <div>
            <p className="text-sm text-t-2 mb-5">Delete this application? This cannot be undone.</p>
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
