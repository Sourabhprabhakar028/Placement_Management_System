import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { resumeAPI, studentAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import { saveAs } from 'file-saver'
import { Upload, Download, Trash2, FileCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Resumes() {
  const { isAdmin } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await studentAPI.getAll({ size: 200 })
      const d = res.data?.content ?? res.data
      setStudents(Array.isArray(d) ? d : [])
    } catch { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpload = async (studentId, file) => {
    if (!file) return
    setUploading(u => ({ ...u, [studentId]: true }))
    try {
      await resumeAPI.upload(studentId, file)
      toast.success('Resume uploaded!')
      load()
    } catch { toast.error('Upload failed') }
    finally { setUploading(u => ({ ...u, [studentId]: false })) }
  }

  const handleDownload = async (studentId, name) => {
    try {
      const res = await resumeAPI.download(studentId)
      saveAs(new Blob([res.data], { type: 'application/pdf' }), `${name}_resume.pdf`)
      toast.success('Downloaded!')
    } catch { toast.error('No resume found') }
  }

  const handleDelete = async (studentId) => {
    try { await resumeAPI.delete(studentId); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Resumes" subtitle="Manage student resumes" />
      <div className="flex-1 overflow-y-auto p-6 page-in">
        <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">
          {loading ? <PageSpinner /> : (
            <table className="tbl">
              <thead><tr>
                <th>Student</th><th>Branch</th><th>CGPA</th><th>Resume</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>
                      <p className="text-xs font-semibold text-t-1">{s.name}</p>
                      <p className="text-[10px] text-t-3 font-mono">{s.email}</p>
                    </td>
                    <td><span className="text-xs font-mono text-t-2">{s.branch}</span></td>
                    <td><span className="text-sm font-bold font-mono text-blue-h">{s.cgpa?.toFixed(2)}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        {s.resumePath ? (
                          <>
                            <span className="flex items-center gap-1 text-[10px] text-accent-green font-mono">
                              <FileCheck size={11} /> Uploaded
                            </span>
                            <button onClick={() => handleDownload(s.id, s.name)} className="btn-ghost flex items-center gap-1">
                              <Download size={11} /> Download
                            </button>
                            {isAdmin && (
                              <button onClick={() => handleDelete(s.id)} className="btn-ghost hover:!border-accent-rose hover:!text-accent-rose">
                                <Trash2 size={11} />
                              </button>
                            )}
                          </>
                        ) : (
                          <label className="btn-ghost flex items-center gap-1 cursor-pointer">
                            {uploading[s.id]
                              ? <span className="text-[10px]">Uploading...</span>
                              : <><Upload size={11} /> Upload</>}
                            <input type="file" accept=".pdf" className="hidden"
                              onChange={e => handleUpload(s.id, e.target.files[0])} />
                          </label>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
