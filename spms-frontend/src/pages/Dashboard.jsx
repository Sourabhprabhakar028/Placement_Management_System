import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { reportAPI } from '../api'
import Topbar from '../components/layout/Topbar'
import StatCard from '../components/ui/StatCard'
import { PageSpinner } from '../components/ui/Spinner'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Users, Building2, CheckCircle, DollarSign,
  TrendingUp, FileText, Clock,
} from 'lucide-react'
import dayjs from 'dayjs'

const SPARK = [35, 50, 42, 68, 58, 82, 100]

const BRANCH_COLORS = {
  CSE: '#3D7EFF', IT: '#5591FF', ECE: '#19C97A',
  MECH: '#F5A623', CIVIL: '#FF4D6D', EEE: '#8B5CF6',
}

const PIE_COLORS = ['#3D7EFF', '#19C97A', '#F5A623']

const ACTIVITY = [
  { icon: CheckCircle, color: '#19C97A', bg: 'rgba(25,201,122,.12)', text: 'Sourabh Prabhakar placed at Google — ₹25L CTC', time: '2 min ago' },
  { icon: Clock,       color: '#3D7EFF', bg: 'rgba(61,126,255,.12)', text: 'Neha Verma interview scheduled · Infosys',          time: '1 hr ago' },
  { icon: FileText,    color: '#F5A623', bg: 'rgba(245,166,35,.12)', text: 'Microsoft shortlisted 4 students',                   time: '3 hrs ago' },
  { icon: Users,       color: '#8B5CF6', bg: 'rgba(139,92,246,.12)', text: 'Rahul Kumar profile created by admin',               time: '5 hrs ago' },
  { icon: Building2,   color: '#0CC8B8', bg: 'rgba(12,200,184,.1)', text: 'Amazon added as a new company',                       time: '8 hrs ago' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-3 border border-line-2 rounded-lg px-3 py-2 text-xs">
      <p className="text-t-3 mb-1">{label}</p>
      <p className="font-semibold font-mono" style={{ color: '#3D7EFF' }}>{payload[0].value} placed</p>
    </div>
  )
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [report, setReport]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportAPI.getSummary()
      .then(r => setReport(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Build branch chart data
  const branchData = report?.branchWiseStats
    ? Object.entries(report.branchWiseStats).map(([branch, count]) => ({ branch, count }))
    : [
        { branch: 'CSE',  count: 68 },
        { branch: 'IT',   count: 48 },
        { branch: 'ECE',  count: 34 },
        { branch: 'MECH', count: 22 },
        { branch: 'CIVIL',count: 14 },
      ]

  const placed    = report?.totalPlaced    ?? 186
  const notPlaced = report?.totalNotPlaced ?? 24
  const inProcess = (report?.totalStudents ?? 248) - placed - notPlaced

  const pieData = [
    { name: 'Placed',    value: placed    },
    { name: 'In process',value: inProcess },
    { name: 'Not placed',value: notPlaced },
  ]

  const name = user?.email?.split('@')[0] ?? 'there'
  const hour = dayjs().hour()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  if (loading) return <PageSpinner />

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5 page-in">

        {/* ── Greeting ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-t-3 uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block" />
              Live dashboard
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {greeting}, <span className="text-blue-h capitalize">{name}</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">Export report</button>
            {isAdmin && <button className="btn-primary"><Users size={12} />Add student</button>}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Students" value={report?.totalStudents ?? 248}
            delta="+12" deltaPositive icon={Users} color="#3D7EFF" spark={SPARK} />
          <StatCard label="Companies" value={report?.totalCompanies ?? 42}
            delta="+3" deltaPositive icon={Building2} color="#19C97A" spark={SPARK} />
          <StatCard label="Placed" value={placed}
            delta={`${Math.round((placed / (report?.totalStudents ?? 248)) * 100)}%`}
            deltaPositive icon={CheckCircle} color="#F5A623" spark={SPARK} />
          <StatCard label="Avg CTC (LPA)" value={`₹${report?.averageCTC?.toFixed(1) ?? '12.4'}L`}
            delta="+1.2L" deltaPositive icon={DollarSign} color="#8B5CF6" spark={SPARK} />
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-5 gap-4">

          {/* Bar chart */}
          <div className="col-span-3 card-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold tracking-tight">Branch-wise placements</p>
                <p className="text-[10px] text-t-3 mt-0.5">Academic year 2025–26</p>
              </div>
              <span className="text-[9px] font-semibold px-2 py-1 rounded-full font-mono"
                style={{ background: 'rgba(61,126,255,.12)', color: '#5591FF' }}>Live</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={branchData} barSize={28}>
                <XAxis dataKey="branch" axisLine={false} tickLine={false}
                  tick={{ fill: '#4A5568', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,.03)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {branchData.map((entry, i) => (
                    <Cell key={i} fill={BRANCH_COLORS[entry.branch] || '#3D7EFF'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie + legend */}
          <div className="col-span-2 card-lg">
            <div className="mb-4">
              <p className="text-sm font-bold tracking-tight">Placement status</p>
              <p className="text-[10px] text-t-3 mt-0.5">All students</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <PieChart width={100} height={100}>
                  <Pie data={pieData} cx={50} cy={50} innerRadius={32} outerRadius={46}
                    startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-bold font-mono">
                    {Math.round((placed / (report?.totalStudents ?? 248)) * 100)}%
                  </span>
                  <span className="text-[8px] text-t-3 uppercase tracking-wider">placed</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {pieData.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-[11px] text-t-2">
                        <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                        {item.name}
                      </div>
                      <span className="text-[11px] font-semibold font-mono">{item.value}</span>
                    </div>
                    <div className="h-1 bg-bg-4 rounded">
                      <div className="h-1 rounded transition-all duration-500"
                        style={{ width: `${Math.round(item.value / (report?.totalStudents ?? 248) * 100)}%`, background: PIE_COLORS[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-5 gap-4">

          {/* Quick stats */}
          <div className="col-span-2 card-lg space-y-3">
            <p className="text-sm font-bold tracking-tight">Quick stats</p>
            {[
              { label: 'Total Applications', value: report?.totalApplications ?? 312, color: '#3D7EFF' },
              { label: 'Highest CTC',        value: `₹${report?.highestCTC ?? 42}L`,  color: '#19C97A' },
              { label: 'Lowest CTC',         value: `₹${report?.lowestCTC  ?? 5}L`,   color: '#F5A623' },
              { label: 'Placement %',        value: `${Math.round((placed / (report?.totalStudents ?? 248)) * 100)}%`, color: '#8B5CF6' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                <span className="text-xs text-t-3">{label}</span>
                <span className="text-sm font-bold font-mono" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div className="col-span-3 card-lg">
            <p className="text-sm font-bold tracking-tight mb-4">Recent activity</p>
            <div className="space-y-0">
              {ACTIVITY.map(({ icon: Icon, color, bg, text, time }, i) => (
                <div key={i} className="flex gap-3 py-2.5 border-b border-line last:border-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: bg, color }}>
                    <Icon size={12} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-t-2 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: text.replace(/^(\S+ \S+)/, '<strong class="text-t-1 font-semibold">$1</strong>')
                      }} />
                    <p className="text-[9px] text-t-3 font-mono mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
