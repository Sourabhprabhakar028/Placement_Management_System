import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { offerLetterAPI, placementAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import { saveAs } from 'file-saver'
import { Upload, Download, Trash2, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function OfferLetters() {
  const { isAdmin } = useAuth()
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await placementAPI.getAll()
      setPlacements(res.data?.content ?? res.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpload = async (placementId, file) => {
    if (!file) return
    try { await offerLetterAPI.upload(placementId, file); toast.success('Offer letter uploaded!'); load() }
    catch { toast.error('Upload failed') }
  }

  const handleDownload = async (placementId, name) => {
    try {
      const res = await offerLetterAPI.download(placementId)
      saveAs(new Blob([res.data], { type: 'application/pdf' }), `${name}_offer.pdf`)
    } catch { toast.error('No offer letter found') }
  }

  const handleDelete = async (placementId) => {
    try { await offerLetterAPI.delete(placementId); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Offer Letters" />
      <div className="flex-1 overflow-y-auto p-6 page-in">
        <div className="bg-bg-1 border border-line rounded-xl overflow-hidden">
          {loading ? <PageSpinner /> : (
            <table className="tbl">
              <thead><tr><th>Student</th><th>Company</th><th>CTC</th><th>Offer Letter</th></tr></thead>
              <tbody>
                {placements.map(p => (
                  <tr key={p.id}>
                    <td><p className="text-xs font-semibold text-t-1">{p.student?.name}</p></td>
                    <td><p className="text-xs text-t-2">{p.company?.name}</p></td>
                    <td><span className="text-sm font-bold font-mono text-accent-green">₹{p.ctcOffered}L</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDownload(p.id, p.student?.name)} className="btn-ghost flex items-center gap-1">
                          <Download size={11} /> Download
                        </button>
                        {isAdmin && (
                          <>
                            <label className="btn-ghost flex items-center gap-1 cursor-pointer">
                              <Upload size={11} /> Upload
                              <input type="file" accept=".pdf" className="hidden"
                                onChange={e => handleUpload(p.id, e.target.files[0])} />
                            </label>
                            <button onClick={() => handleDelete(p.id)} className="btn-ghost hover:!border-accent-rose hover:!text-accent-rose">
                              <Trash2 size={11} />
                            </button>
                          </>
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
