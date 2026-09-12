import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { studentAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import Chip from '../components/ui/Chip'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { Users, Plus, Search, SlidersHorizontal, Pencil, Trash2, X } from 'lucide-react'

const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE']
const STATUSES = ['All', 'NOT_PLACED', 'IN_PROCESS', 'PLACED']

const AVATAR_COLORS = [
  '#3D7EFF','#19C97A','#F5A623','#FF4D6D','#8B5CF6','#0CC8B8','#F59E0B'
]
const getColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const cgpaColor = (v) => {
  if (v >= 8.5) return '#3CDFA0'
  if (v >= 7)   return '#6AA8FF'
  if (v >= 6)   return '#F5C063'
  return '#FF7A90'
}

function StudentForm({ onSubmit, defaultValues, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  const required = { required: 'Required' }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Full name</label>
          <input className={`inp ${errors.name ? 'border-accent-rose' : ''}`} placeholder="Sourabh Prabhakar"
            {...register('name', required)} />
          {errors.name && <p className="text-[10px] text-accent-rose mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Email</label>
          <input className={`inp ${errors.email ? 'border-accent-rose' : ''}`} type="email" placeholder="student@college.edu"
            {...register('email', required)} />
          {errors.email && <p className="text-[10px] text-accent-rose mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Branch</label>
          <select className="inp" {...register('branch', required)}>
            {BRANCHES.slice(1).map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">CGPA</label>
          <input className="inp" type="number" step="0.01" min="0" max="10" placeholder="8.55"
            {...register('cgpa', { ...required, min: 0, max: 10 })} />
        </div>
        <div>
          <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Percentage %</label>
          <input className="inp" type="number" step="0.01" min="0" max="100" placeholder="85.5"
            {...register('percentage', required)} />
        </div>
      </div>
      <div>
        <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Skills (comma-separated)</label>
        <input className="inp" placeholder="Java, React, Spring Boot, MySQL"
          {...register('skills')} />
      </div>
      <div>
        <label className="block text-[9px] font-bold text-t-3 tracking-widest uppercase mb-1.5">Placement status</label>
        <select className="inp" {...register('placementStatus')}>
          <option value="NOT_PLACED">Not Placed</option>
          <option value="IN_PROCESS">In Process</option>
          <option value="PLACED">Placed</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-blue rounded-lg text-white text-sm font-bold hover:bg-blue-h transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
          : 'Save student'}
      </button>
    </form>
  )
}

export default function Students() {
  const [students, setStudents]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [search, setSearch]             = useState('')
  const [branch, setBranch]             = useState('All')
  const [status, setStatus]             = useState('All')
  const [page, setPage]                 = useState(0)
  const [totalPages, setTotalPages]     = useState(1)
  const [showAdd, setShowAdd]           = useState(false)
  const [editStudent, setEditStudent]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const PAGE_SIZE = 8

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (search.trim()) {
        res = await studentAPI.search(search.trim())
        setStudents(res.data)
        setTotalPages(1)
      } else if (branch !== 'All' || status !== 'All') {
        res = await studentAPI.filter({
          branch: branch !== 'All' ? branch : undefined,
          status: status !== 'All' ? status : undefined,
        })
        setStudents(res.data)
        setTotalPages(1)
      } else {
        res = await studentAPI.getAll({ page, size: PAGE_SIZE, sort: 'id,desc' })
        const d = res.data
        if (d.content) {
          setStudents(d.content)
          setTotalPages(d.totalPages)
        } else {
          setStudents(d)
          setTotalPages(1)
        }
      }
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [search, branch, status, page])

  useEffect(() => { load() }, [load])

  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await studentAPI.create(data)
      toast.success('Student added!')
      setShowAdd(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to add student')
    } finally { setSaving(false) }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try {
      await studentAPI.update(editStudent.id, data)
      toast.success('Student updated!')
      setEditStudent(null)
      load()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to update')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await studentAPI.delete(deleteTarget.id)
      toast.success('Student deleted')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const clearFilters = () => { setSearch(''); setBranch('All'); setStatus('All'); setPage(0) }

  const hasFilters = search || branch !== 'All' || status !== 'All'

  // Mini stats
  const placed    = students.filter(s => s.placementStatus === 'PLACED').length
  const inProcess = students.filter(s => s.placementStatus === 'IN_PROCESS').length
  const notPlaced = students.filter(s => s.placementStatus === 'NOT_PLACED').length

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Students" subtitle={`${students.length} shown`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-4 page-in">

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total shown', value: students.length, color: '#3D7EFF' },
            { label: 'Placed',      value: placed,          color: '#19C97A' },
            { label: 'In process',  value: inProcess,       color: '#F5A623' },
            { label: 'Not placed',  value: notPlaced,       color: '#FF4D6D' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-bg-1 border border-line rounded-xl px-4 py-3">
              <p className="text-[9px] font-semibold text-t-3 tracking-widest uppercase mb-1.5">{label}</p>
              <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">

          {/* Toolbar */}
          <div className="px-4 py-3 flex items-center gap-2 border-b border-line bg-bg-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-bg-1 border border-line-2 rounded-lg px-3 py-2 min-w-[200px] focus-within:border-blue transition-colors">
              <Search size={12} className="text-t-3 flex-shrink-0" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Search students..."
                className="bg-transparent outline-none text-xs text-t-1 placeholder-t-4 w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-t-3 hover:text-t-2">
                  <X size={10} />
                </button>
              )}
            </div>

            {/* Branch filter */}
            <select
              value={branch}
              onChange={e => { setBranch(e.target.value); setPage(0) }}
              className="bg-bg-1 border border-line-2 rounded-lg px-3 py-2 text-xs text-t-2 outline-none cursor-pointer hover:border-line-3 transition-colors"
            >
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>

            {/* Status filter */}
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(0) }}
              className="bg-bg-1 border border-line-2 rounded-lg px-3 py-2 text-xs text-t-2 outline-none cursor-pointer hover:border-line-3 transition-colors"
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>

            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost flex items-center gap-1">
                <X size={10} /> Clear
              </button>
            )}

            {/* Add button */}
            <button onClick={() => setShowAdd(true)} className="btn-primary ml-auto">
              <Plus size={12} /> Add student
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <PageSpinner />
          ) : students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students found"
              desc={hasFilters ? 'Try clearing your filters.' : 'Add your first student to get started.'}
              action={
                <button onClick={() => setShowAdd(true)} className="btn-primary mx-auto">
                  <Plus size={12} /> Add student
                </button>
              }
            />
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Percentage</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const initials = s.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??'
                  return (
                    <tr key={s.id}>
                      {/* Name + avatar */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ background: getColor(s.name) }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-t-1">{s.name}</p>
                            <p className="text-[10px] text-t-3 font-mono mt-0.5">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs font-semibold font-mono text-t-1">{s.branch}</span>
                      </td>
                      <td>
                        <span className="text-sm font-bold font-mono" style={{ color: cgpaColor(s.cgpa) }}>
                          {s.cgpa?.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-mono text-t-2">{s.percentage?.toFixed(1)}%</span>
                      </td>
                      <td>
                        <span className="text-[10px] text-t-3 max-w-[140px] truncate block">
                          {s.skills || '—'}
                        </span>
                      </td>
                      <td>
                        <Chip label={s.placementStatus} />
                      </td>
                      <td>
                        <div className="flex gap-1.5">
                          <button className="btn-ghost" onClick={() => setEditStudent(s)}>
                            <Pencil size={11} />
                          </button>
                          <button
                            className="btn-ghost hover:!border-accent-rose hover:!text-accent-rose"
                            onClick={() => setDeleteTarget(s)}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-line bg-bg-2">
              <span className="text-[10px] text-t-3 font-mono">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  className={`pb-btn w-7 h-7 rounded-md text-[10px] font-mono border transition-all duration-100 ${page === 0 ? 'border-line text-t-4 cursor-not-allowed' : 'border-line-2 text-t-2 hover:border-blue hover:text-blue-h cursor-pointer'}`}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-7 h-7 rounded-md text-[10px] font-mono border transition-all duration-100 ${page === i ? 'bg-blue border-blue text-white' : 'border-line-2 text-t-2 hover:border-blue hover:text-blue-h'}`}
                  >{i + 1}</button>
                ))}
                <button
                  className={`w-7 h-7 rounded-md text-[10px] font-mono border transition-all duration-100 ${page >= totalPages - 1 ? 'border-line text-t-4 cursor-not-allowed' : 'border-line-2 text-t-2 hover:border-blue hover:text-blue-h cursor-pointer'}`}
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Student" width="max-w-xl">
        <StudentForm onSubmit={handleAdd} loading={saving}
          defaultValues={{ placementStatus: 'NOT_PLACED', branch: 'CSE' }} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student" width="max-w-xl">
        {editStudent && (
          <StudentForm onSubmit={handleEdit} loading={saving} defaultValues={editStudent} />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" width="max-w-sm">
        {deleteTarget && (
          <div>
            <p className="text-sm text-t-2 mb-5">
              Are you sure you want to delete <strong className="text-t-1">{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-accent-rose rounded-lg text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
