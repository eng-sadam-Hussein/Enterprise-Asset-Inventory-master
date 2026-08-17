import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  HardDrive,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDateTime } from '../utils/format';
import { ASSET_CATEGORY_LABELS } from '../utils/labels';

function Stat({ label, value, meta, icon: Icon, tone = 'blue' }: { label: string; value: string | number; meta: string; icon: any; tone?: string }) {
  const tones: Record<string, string> = {
    blue: 'bg-[#eaf2ff] text-[#0D47A1]',
    teal: 'bg-[#e8fbf8] text-[#08796f]',
    orange: 'bg-[#fff3e5] text-[#d96d00]',
    violet: 'bg-violet-50 text-violet-700',
  };
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="metric-label">{label}</p>
          <p className="metric-value">{value}</p>
        </div>
        <div className={`rounded-[14px] p-2.5 transition group-hover:-translate-y-0.5 ${tones[tone]}`}><Icon className="h-[18px] w-[18px]" /></div>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">{meta}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data, has } = useWorkspace();
  const { user } = useAuth();
  const totalValue = data.assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0);
  const assigned = data.assets.filter((asset) => asset.status === 'ASSIGNED').length;
  const available = data.assets.filter((asset) => asset.status === 'AVAILABLE').length;
  const maintenanceAssets = data.assets.filter((asset) => asset.status === 'UNDER_MAINTENANCE').length;
  const retired = data.assets.filter((asset) => asset.status === 'RETIRED').length;
  const low = data.stock.filter((item) => item.lowStock).length;
  const openMaint = data.maintenance.filter((item) => item.status === 'SCHEDULED' || item.status === 'IN_PROGRESS').length;
  const activeAssignments = data.assignments.filter((item) => item.status === 'ACTIVE').length;
  const compliance = Math.round((data.assets.filter((asset) => asset.status !== 'RETIRED').length / Math.max(1, data.assets.length)) * 100);
  const activeUsers = data.users.filter((item) => item.active !== false).length;
  const categoryCounts = Object.entries(data.assets.reduce((acc: Record<string, number>, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const maxCategory = Math.max(1, ...categoryCounts.map((item) => item[1]));
  const monthly = [68, 74, 79, 73, 83, 88, 91, 86, 94, 97, 93, 99];
  const firstName = user?.fullName?.split(' ')[0] || 'Operator';

  const statusMix = [
    { label: 'Available', value: available, color: '#11B5A6' },
    { label: 'Assigned', value: assigned, color: '#0D47A1' },
    { label: 'Maintenance', value: maintenanceAssets, color: '#FF8C00' },
    { label: 'Retired', value: retired, color: '#94A3B8' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <section className="dashboard-hero">
        <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.14em] text-[#9af0e8]"><Sparkles className="h-3 w-3 text-[#ffad43]" /> Executive workspace</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-[9px] font-bold text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Data synchronized locally</span>
            </div>
            <h1 className="text-[25px] font-extrabold tracking-[-.04em] text-white sm:text-[30px]">Welcome back, {firstName}</h1>
            <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-slate-300">Monitor assets, stock exposure, custody, maintenance and operational activity from one clear command center.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="rounded-[16px] border border-white/10 bg-white/[.07] px-3.5 py-2.5 backdrop-blur-xl">
              <p className="text-[8px] font-extrabold uppercase tracking-[.13em] text-slate-400">Compliance</p>
              <p className="mt-0.5 text-lg font-extrabold text-white">{compliance}%</p>
            </div>
            <div className="rounded-[16px] border border-white/10 bg-white/[.07] px-3.5 py-2.5 backdrop-blur-xl">
              <p className="text-[8px] font-extrabold uppercase tracking-[.13em] text-slate-400">Active users</p>
              <p className="mt-0.5 text-lg font-extrabold text-white">{activeUsers}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Asset portfolio" value={data.assets.length} meta={`${available} available · ${assigned} assigned`} icon={HardDrive} />
        <Stat label="Portfolio value" value={formatCurrency(totalValue)} meta="Acquisition value across the asset register" icon={CircleDollarSign} tone="teal" />
        <Stat label="Inventory lines" value={data.stock.length} meta={`${low} line${low === 1 ? '' : 's'} below minimum stock`} icon={Boxes} tone="orange" />
        <Stat label="Open maintenance" value={openMaint} meta={`${data.maintenance.filter((item) => item.status === 'IN_PROGRESS').length} ticket(s) currently in progress`} icon={Wrench} tone="violet" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.18fr_.82fr]">
        <section className="panel">
          <div className="panel-head">
            <div><p className="panel-kicker">Operational trend</p><h2 className="panel-title">Asset readiness index</h2></div>
            <div className="flex items-center gap-1.5 rounded-xl bg-[#e8fbf8] px-2.5 py-1.5 text-[10px] font-extrabold text-[#08796f]"><ArrowUpRight className="h-3.5 w-3.5" /> 8.4% vs last period</div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
            <div>
              <svg viewBox="0 0 720 210" className="h-[185px] w-full overflow-visible sm:h-[200px]">
                <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0D47A1" stopOpacity=".22" /><stop offset="1" stopColor="#0D47A1" stopOpacity="0" /></linearGradient></defs>
                {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="0" y1={y} x2="720" y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />)}
                <path d={monthly.map((value, index) => `${index === 0 ? 'M' : 'L'} ${index * (720 / 11)} ${200 - (value - 60) * 3.15}`).join(' ') + ' L 720 210 L 0 210 Z'} fill="url(#fill)" />
                <path d={monthly.map((value, index) => `${index === 0 ? 'M' : 'L'} ${index * (720 / 11)} ${200 - (value - 60) * 3.15}`).join(' ')} fill="none" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {monthly.map((value, index) => <circle key={index} cx={index * (720 / 11)} cy={200 - (value - 60) * 3.15} r="3.8" fill="white" stroke="#0D47A1" strokeWidth="2.5" />)}
              </svg>
              <div className="mt-1 flex justify-between text-[8px] font-bold uppercase tracking-wide text-slate-400"><span>Sep</span><span>Nov</span><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Aug</span></div>
            </div>
            <div className="space-y-2.5">
              <div className="rounded-[18px] bg-[#06162f] p-3.5 text-white">
                <p className="text-[10px] text-slate-400">Current readiness</p><p className="mt-0.5 text-[25px] font-extrabold">94.2%</p>
                <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300"><PackageCheck className="h-3.5 w-3.5" /> Healthy operating range</p>
              </div>
              <div className="rounded-[18px] border border-slate-200 p-3.5">
                <p className="text-[10px] text-slate-500">Custody coverage</p>
                <p className="mt-0.5 text-xl font-extrabold text-slate-950">{Math.round((assigned / Math.max(1, data.assets.filter((asset) => asset.status !== 'RETIRED').length)) * 100)}%</p>
                <p className="mt-1.5 text-[9px] leading-4 text-slate-400">Named assignment ownership across active assets.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><div><p className="panel-kicker">Portfolio health</p><h2 className="panel-title">Asset status & category mix</h2></div><ShieldCheck className="h-[18px] w-[18px] text-[#0D47A1]" /></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr] xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
            <div className="relative mx-auto grid h-[142px] w-[142px] place-items-center rounded-full" style={{ background: `conic-gradient(${statusMix.map((item, index) => `${item.color} ${statusMix.slice(0, index).reduce((sum, x) => sum + x.value, 0) / Math.max(1, data.assets.length) * 100}% ${(statusMix.slice(0, index + 1).reduce((sum, x) => sum + x.value, 0) / Math.max(1, data.assets.length)) * 100}%`).join(',')})` }}>
              <div className="grid h-[98px] w-[98px] place-items-center rounded-full bg-white text-center shadow-inner"><div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Assets</p><p className="text-[25px] font-extrabold text-slate-950">{data.assets.length}</p></div></div>
            </div>
            <div className="space-y-2.5">
              {statusMix.map((item) => <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} /><span className="text-[10px] font-semibold text-slate-600">{item.label}</span></div><span className="text-[11px] font-extrabold text-slate-950">{item.value}</span></div>)}
            </div>
          </div>
          <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
            {categoryCounts.slice(0, 4).map(([category, count]) => <div key={category}><div className="mb-1 flex items-center justify-between text-[9px]"><span className="font-semibold text-slate-600">{ASSET_CATEGORY_LABELS[category as keyof typeof ASSET_CATEGORY_LABELS]}</span><span className="font-extrabold text-slate-950">{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#0D47A1] via-[#1685c9] to-[#11B5A6]" style={{ width: `${(count / maxCategory) * 100}%` }} /></div></div>)}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_310px]">
        <section className="panel overflow-hidden p-0">
          <div className="panel-head border-b border-slate-100 px-4 py-3.5 sm:px-5"><div><p className="panel-kicker">Audit trail</p><h2 className="panel-title">Recent workspace activity</h2></div><span className="text-[10px] font-semibold text-slate-400">Latest 7 events</span></div>
          <div className="overflow-x-auto"><table className="pro-table"><thead><tr><th>Operator</th><th>Activity</th><th>Entity</th><th>Timestamp</th></tr></thead><tbody>{data.activities.slice(0, 7).map((activity) => <tr key={activity.id}><td><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eaf2ff] text-[9px] font-extrabold uppercase text-[#0D47A1]">{activity.username.slice(0, 2)}</span><span className="font-semibold">@{activity.username}</span></div></td><td>{activity.description}</td><td><span className="soft-badge">{activity.entityType} #{activity.entityId}</span></td><td>{formatDateTime(activity.createdAt)}</td></tr>)}</tbody></table></div>
        </section>

        <section className="space-y-3">
          <div className="rounded-[20px] border border-orange-200 bg-gradient-to-br from-[#fff8ef] to-[#fff2df] p-4">
            <div className="flex items-center justify-between"><div className="rounded-xl bg-white p-2.5 text-[#e87700] shadow-sm"><TriangleAlert className="h-[18px] w-[18px]" /></div><span className="text-[10px] font-extrabold text-[#bd5f00]">Needs attention</span></div>
            <p className="mt-3 text-[26px] font-extrabold text-slate-950">{low}</p><p className="text-[11px] font-bold text-slate-800">Low-stock inventory lines</p>
            <Link to="/stock" className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0D47A1]">Review inventory <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="rounded-[20px] border border-[#b8eee9] bg-gradient-to-br from-[#eefcf9] to-[#eff7ff] p-4">
            <div className="flex items-center justify-between"><div className="rounded-xl bg-white p-2.5 text-[#08796f] shadow-sm"><ClipboardCheck className="h-[18px] w-[18px]" /></div><span className="text-[10px] font-extrabold text-[#08796f]">Custody</span></div>
            <p className="mt-3 text-[26px] font-extrabold text-slate-950">{activeAssignments}</p><p className="text-[11px] font-bold text-slate-800">Active equipment assignments</p>
            <Link to="/assignments" className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0D47A1]">Open assignments <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </section>
      </div>

      <section className="panel p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="panel-kicker">Quick navigation</p><h2 className="panel-title">Continue an operational workflow</h2></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Link to="/assets" className="dashboard-action"><HardDrive className="h-4 w-4" /> Assets</Link>
            <Link to="/stock" className="dashboard-action"><Boxes className="h-4 w-4" /> Inventory</Link>
            <Link to="/maintenance" className="dashboard-action"><Wrench className="h-4 w-4" /> Maintenance</Link>
            {has('users.manage') ? <Link to="/users" className="dashboard-action"><UsersRound className="h-4 w-4" /> Users</Link> : <Link to="/reports" className="dashboard-action"><BarChart3 className="h-4 w-4" /> Reports</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}

