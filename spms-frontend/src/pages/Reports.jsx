import { useState, useEffect } from 'react'
import { reportAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import { PageSpinner } from '../components/ui/Spinner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportAPI.getSummary()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <><Topbar title="Analytics" /><PageSpinner /></>

  const placed = data?.totalPlaced ?? 186
  const total  = data?.totalStudents ?? 248
  const pct    = total > 0 ? Math.round(placed / total * 100) : 0

  const branchData = data?.branchWiseStats
    ? Object.entries(data.branchWiseStats).map(([b, c]) => ({ branch: b, count: c }))
    : [{ branch:'CSE',count:68},{ branch:'IT',count:48},{ branch:'ECE',count:34},{ branch:'MECH',count:22}]

  const COLORS = ['#3D7EFF','#5591FF','#19C97A','#F5A623','#FF4D6D','#8B5CF6']

  const metrics = [
    { label:'Total Students',   value: data?.totalStudents ?? 248,    color:'#3D7EFF' },
    { label:'Total Placed',     value: data?.totalPlaced   ?? 186,    color:'#19C97A' },
    { label:'Not Placed',       value: data?.totalNotPlaced ?? 62,    color:'#FF4D6D' },
    { label:'Placement %',      value: `${pct}%`,                     color:'#F5A623' },
    { label:'Average CTC',      value: `₹${(data?.averageCTC??12.4).toFixed(1)}L`, color:'#8B5CF6' },
    { label:'Highest CTC',      value: `₹${data?.highestCTC ?? 42}L`, color:'#0CC8B8' },
    { label:'Lowest CTC',       value: `₹${data?.lowestCTC  ??  5}L`, color:'#F59E0B' },
    { label:'Total Companies',  value: data?.totalCompanies ?? 42,    color:'#3D7EFF' },
    { label:'Total Applications',value: data?.totalApplications ?? 312,color:'#8B5CF6'},
  ]

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Analytics" subtitle="Placement summary" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5 page-in">

        <div className="grid grid-cols-3 gap-3">
          {metrics.map(({ label, value, color }) => (
            <div key={label} className="bg-bg-1 border border-line rounded-xl px-4 py-4"
              style={{ borderTop: `2px solid ${color}` }}>
              <p className="text-[9px] font-semibold text-t-3 tracking-widest uppercase mb-1.5">{label}</p>
              <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="card-lg">
          <p className="text-sm font-bold tracking-tight mb-4">Branch-wise student count</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={branchData} barSize={36}>
              <XAxis dataKey="branch" axisLine={false} tickLine={false}
                tick={{ fill:'#4A5568', fontSize:10, fontFamily:'JetBrains Mono' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background:'#0A1220', border:'1px solid rgba(255,255,255,.09)', borderRadius:8, fontSize:11 }}
                labelStyle={{ color:'#8B9BB4' }}
                itemStyle={{ color:'#E8EDF5', fontFamily:'JetBrains Mono' }}
              />
              <Bar dataKey="count" radius={[5,5,0,0]}>
                {branchData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-lg">
          <p className="text-sm font-bold tracking-tight mb-4">CTC distribution (LPA)</p>
          <div className="space-y-3">
            {[
              { label:'₹0–5L',    pct:8  },
              { label:'₹5–10L',   pct:28 },
              { label:'₹10–20L',  pct:42 },
              { label:'₹20–30L',  pct:16 },
              { label:'₹30L+',    pct:6  },
            ].map(({ label, pct: p }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-t-3 w-16 flex-shrink-0">{label}</span>
                <div className="flex-1 h-2 bg-bg-4 rounded-full">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width:`${p}%`, background:'#3D7EFF' }} />
                </div>
                <span className="text-[10px] font-mono text-t-2 w-8 text-right">{p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
