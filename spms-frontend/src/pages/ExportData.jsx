import { useState } from 'react'
import { toast } from 'react-toastify'
import { exportAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { saveAs } from 'file-saver'
import { FileSpreadsheet, FileText, Download, Loader } from 'lucide-react'

const EXPORTS = [
  {
    key: 'studentsExcel',
    title: 'Students — Excel',
    desc: 'All student records with CGPA, branch, and placement status.',
    icon: FileSpreadsheet,
    color: '#19C97A',
    filename: 'SPMS_Students.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    key: 'placementsExcel',
    title: 'Placements — Excel',
    desc: 'All placement records with CTC, company, and offer date.',
    icon: FileSpreadsheet,
    color: '#3D7EFF',
    filename: 'SPMS_Placements.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    key: 'placementsPdf',
    title: 'Placements — PDF',
    desc: 'Print-ready placement report with all student offer details.',
    icon: FileText,
    color: '#FF4D6D',
    filename: 'SPMS_Placements.pdf',
    type: 'application/pdf',
  },
]

export default function ExportData() {
  const [downloading, setDownloading] = useState({})

  const handleExport = async (exp) => {
    setDownloading(d => ({ ...d, [exp.key]: true }))
    try {
      const res = await exportAPI[exp.key]()
      const blob = new Blob([res.data], { type: exp.type })
      saveAs(blob, exp.filename)
      toast.success(`${exp.filename} downloaded!`)
    } catch {
      toast.error('Export failed — make sure the backend is running')
    } finally {
      setDownloading(d => ({ ...d, [exp.key]: false }))
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Export Data" />
      <div className="flex-1 overflow-y-auto p-6 page-in">
        <div className="grid grid-cols-3 gap-4">
          {EXPORTS.map(exp => {
            const Icon = exp.icon
            const busy = downloading[exp.key]
            return (
              <div key={exp.key} className="bg-bg-1 border border-line rounded-xl p-6 flex flex-col gap-4"
                style={{ borderTop: `2px solid ${exp.color}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${exp.color}18`, color: exp.color }}>
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight mb-1">{exp.title}</p>
                  <p className="text-xs text-t-3 leading-relaxed">{exp.desc}</p>
                </div>
                <button
                  onClick={() => handleExport(exp)}
                  disabled={busy}
                  className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 disabled:opacity-60"
                  style={{ background: exp.color, color: '#fff' }}
                >
                  {busy
                    ? <><Loader size={13} className="animate-spin" /> Downloading...</>
                    : <><Download size={13} /> Download</>}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
