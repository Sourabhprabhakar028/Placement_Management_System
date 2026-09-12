import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { companyAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import Chip from '../components/ui/Chip'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { Building2, Plus, Search, MapPin, Pencil, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LOGO_COLORS = ['#3D7EFF','#19C97A','#F5A623','#FF4D6D','#8B5CF6','#0CC8B8','#F59E0B','#06B6D4']
const getLogoColor = (name='') => LOGO_COLORS[name.charCodeAt(0) % LOGO_COLORS.length]

function CompanyForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  const req = { required: 'Required' }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Company name</label>
          <input className={`inp ${errors.name?'border-accent-rose':''}`} placeholder="Google" {...register('name',req)}/>
          {errors.name&&<p className="text-[10px] text-accent-rose mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Location</label>
          <input className="inp" placeholder="Bangalore" {...register('location',req)}/>
        </div>
      </div>
      <div>
        <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Description</label>
        <textarea className="inp resize-none" rows={3} placeholder="About the company and job role..."
          {...register('description')}/>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Min CGPA</label>
          <input className="inp" type="number" step="0.1" min="0" max="10" placeholder="7.5"
            {...register('minCgpa',req)}/>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Min CTC (LPA)</label>
          <input className="inp" type="number" step="0.1" min="0" placeholder="10"
            {...register('minCtc',req)}/>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Max CTC (LPA)</label>
          <input className="inp" type="number" step="0.1" min="0" placeholder="30"
            {...register('maxCtc',req)}/>
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h transition-all duration-150 disabled:opacity-60">
        {loading ? 'Saving...' : 'Save company'}
      </button>
    </form>
  )
}

export default function Companies() {
  const { isAdmin } = useAuth()
  const [companies, setCompanies]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [search, setSearch]             = useState('')
  const [showAdd, setShowAdd]           = useState(false)
  const [editCompany, setEditCompany]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = search.trim()
        ? await companyAPI.search(search.trim())
        : await companyAPI.getAll()
      setCompanies(res.data?.content ?? res.data)
    } catch { toast.error('Failed to load companies') }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleAdd = async (data) => {
    setSaving(true)
    try { await companyAPI.create(data); toast.success('Company added!'); setShowAdd(false); load() }
    catch (e) { toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try { await companyAPI.update(editCompany.id,data); toast.success('Company updated!'); setEditCompany(null); load() }
    catch (e) { toast.error(e.response?.data?.error||'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await companyAPI.delete(deleteTarget.id); toast.success('Company deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Companies" subtitle={`${companies.length} registered`} />
      <div className="flex-1 overflow-y-auto p-6 page-in">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-bg-1 border border-line-2 rounded-lg px-3 py-2 min-w-[220px] focus-within:border-blue transition-colors">
            <Search size={12} className="text-t-3 flex-shrink-0" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search companies..."
              className="bg-transparent outline-none text-xs text-t-1 placeholder-t-4 w-full" />
            {search && <button onClick={()=>setSearch('')} className="text-t-3 hover:text-t-2"><X size={10}/></button>}
          </div>
          {isAdmin && (
            <button onClick={()=>setShowAdd(true)} className="btn-primary ml-auto">
              <Plus size={12}/> Add company
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? <PageSpinner /> : companies.length === 0 ? (
          <EmptyState icon={Building2} title="No companies found"
            desc="Add your first company to get started."
            action={isAdmin && <button onClick={()=>setShowAdd(true)} className="btn-primary mx-auto"><Plus size={12}/>Add company</button>}
          />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {companies.map(c => {
              const color = getLogoColor(c.name)
              const initials = c.name?.slice(0,1).toUpperCase()
              return (
                <div key={c.id} className="bg-bg-1 border border-line rounded-xl p-5 cursor-pointer hover:border-line-3 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group"
                  style={{ borderTop: `2px solid ${color}` }}>

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg text-white flex-shrink-0 relative overflow-hidden"
                      style={{ background: color }}>
                      {initials}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"/>
                    </div>
                    <span className="chip chip-green">Hiring</span>
                  </div>

                  <p className="text-sm font-bold tracking-tight text-t-1 mb-1">{c.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-t-3 mb-4">
                    <MapPin size={10}/> {c.location || 'India'}
                  </div>

                  {/* Stats */}
                  <div className="h-px bg-line mb-4"/>
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div>
                      <p className="text-sm font-bold font-mono text-t-1">{c.minCgpa}</p>
                      <p className="text-[9px] text-t-3 mt-0.5">Min CGPA</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-mono" style={{color:'#3CDFA0'}}>₹{c.minCtc}L</p>
                      <p className="text-[9px] text-t-3 mt-0.5">Min CTC</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-mono" style={{color:'#A68CF8'}}>₹{c.maxCtc}L</p>
                      <p className="text-[9px] text-t-3 mt-0.5">Max CTC</p>
                    </div>
                  </div>

                  {/* Description preview */}
                  {c.description && (
                    <p className="text-[10px] text-t-3 leading-relaxed line-clamp-2 mb-4">{c.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg border border-line text-t-2 text-[11px] font-semibold hover:border-line-3 hover:text-t-1 transition-all duration-150">
                      View details
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={()=>setEditCompany(c)} className="btn-ghost p-2">
                          <Pencil size={11}/>
                        </button>
                        <button onClick={()=>setDeleteTarget(c)}
                          className="btn-ghost p-2 hover:!border-accent-rose hover:!text-accent-rose">
                          <Trash2 size={11}/>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Company" width="max-w-xl">
        <CompanyForm onSubmit={handleAdd} loading={saving} defaultValues={{minCgpa:6,minCtc:5,maxCtc:20}}/>
      </Modal>
      <Modal open={!!editCompany} onClose={()=>setEditCompany(null)} title="Edit Company" width="max-w-xl">
        {editCompany && <CompanyForm onSubmit={handleEdit} loading={saving} defaultValues={editCompany}/>}
      </Modal>
      <Modal open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} title="Confirm Delete" width="max-w-sm">
        {deleteTarget && (
          <div>
            <p className="text-sm text-t-2 mb-5">Delete <strong className="text-t-1">{deleteTarget.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-accent-rose rounded-lg text-white text-xs font-bold hover:opacity-90">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
