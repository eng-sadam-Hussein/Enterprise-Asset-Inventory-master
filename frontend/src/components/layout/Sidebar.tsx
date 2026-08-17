import { Activity, Archive, BarChart3, Boxes, ClipboardCheck, Gauge, HardDrive, Settings2, ShieldCheck, Users, Wrench, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { COMPANY } from '../../constants/brand';
import { can, ROLE_LABELS } from '../../utils/permissions';
import type { Permission } from '../../api/types';

const nav: { to: string; label: string; icon: any; permission: Permission }[] = [
  { to: '/dashboard', label: 'Overview', icon: Gauge, permission: 'dashboard.read' },
  { to: '/assets', label: 'Asset Registry', icon: HardDrive, permission: 'assets.read' },
  { to: '/stock', label: 'Inventory', icon: Boxes, permission: 'stock.read' },
  { to: '/assignments', label: 'Assignments', icon: ClipboardCheck, permission: 'assignments.read' },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench, permission: 'maintenance.read' },
  { to: '/scan', label: 'Asset Lookup', icon: Archive, permission: 'assets.read' },
  { to: '/reports', label: 'Reports & Insights', icon: BarChart3, permission: 'reports.read' },
  { to: '/users', label: 'Access Control', icon: Users, permission: 'users.manage' },
  { to: '/settings', label: 'System Settings', icon: Settings2, permission: 'users.manage' },
];

function Initials({ name = '' }: { name?: string }) {
  return <>{name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</>;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const { user } = useAuth();
  const visible = nav.filter((item) => can(user?.role, item.permission));

  return <>
    {mobileOpen && <button className="fixed inset-0 z-40 bg-[#06162f]/55 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} aria-label="Close navigation" />}
    <aside className={`fixed inset-y-0 left-0 z-50 w-[248px] border-r border-white/10 bg-[#07152f] text-white shadow-2xl transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(17,181,166,.20),transparent_34%),radial-gradient(circle_at_85%_42%,rgba(255,140,0,.10),transparent_28%),linear-gradient(180deg,#07152f_0%,#0a244c_100%)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={COMPANY.logoWhite} className="h-10 w-10" alt="Nexora" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#77e7dc]">Nexora</p>
              <h1 className="text-base font-extrabold tracking-[-.02em]">AssetOps</h1>
            </div>
          </div>
          <button onClick={onCloseMobile} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <div className="mx-3.5 mt-3.5 rounded-[18px] border border-white/10 bg-white/[.055] p-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {user?.profileImage ? <img src={user.profileImage} alt={user.fullName} className="h-10 w-10 shrink-0 rounded-[14px] object-cover ring-1 ring-white/15" /> : <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#11B5A6] text-sm font-extrabold text-white"><Initials name={user?.fullName} /></div>}
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-400">{user?.role ? ROLE_LABELS[user.role] : ''}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#11B5A6]/10 px-3 py-2 text-[11px] font-semibold text-[#82eadf]"><ShieldCheck className="h-3.5 w-3.5" /> Role-based session active</div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3.5 py-4">
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-500">Workspace</p>
          {visible.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onCloseMobile} className={({ isActive }) => `group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-semibold transition ${isActive ? 'bg-white text-[#07152f] shadow-lg' : 'text-slate-300 hover:bg-white/[.07] hover:text-white'}`}><Icon className={`h-[18px] w-[18px]`} />{label}</NavLink>)}
        </nav>

        <div className="border-t border-white/10 px-4 py-3.5">
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500"><span>Workspace v5.0</span><span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> Local-first</span></div>
          <p className="text-[10px] leading-4 text-slate-500">Developed by <span className="font-bold text-[#ffad43]">{COMPANY.developedBy}</span> · Upwork Freelancer</p>
        </div>
      </div>
    </aside>
  </>;
}
