import { Bell, ChevronDown, LogOut, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const names: Record<string, string> = {
  dashboard: 'Executive Overview',
  assets: 'Asset Registry',
  stock: 'Inventory Control',
  assignments: 'Custody & Assignments',
  maintenance: 'Maintenance Center',
  scan: 'Asset Lookup',
  reports: 'Reports & Insights',
  users: 'Access Control',
  settings: 'System Settings',
};

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const page = useLocation().pathname.split('/')[1] || 'dashboard';
  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="flex h-[62px] items-center gap-3 px-3 sm:h-[64px] sm:gap-4 sm:px-6 lg:px-6">
      <button onClick={onMenuClick} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 lg:hidden"><Menu className="h-5 w-5" /></button>
      <div className="min-w-0 flex-1">
        <p className="hidden text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0D47A1] sm:block">Nexora Technologies</p>
        <h2 className="truncate text-base font-extrabold tracking-[-.02em] text-[#07152f] sm:text-lg">{names[page] || 'AssetOps'}</h2>
      </div>
      <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 xl:flex"><Search className="h-4 w-4" /><span>Search workspace</span><kbd className="ml-8 rounded border bg-white px-1.5 py-0.5 text-[10px]">⌘K</kbd></div>
      <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF8C00] ring-2 ring-white" /></button>
      <div className="hidden items-center gap-2 sm:flex">
        {user?.profileImage ? <img src={user.profileImage} alt={user.fullName} className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200" /> : <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0D47A1] text-xs font-extrabold text-white">{user?.fullName?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      <button onClick={logout} title="Sign out" className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"><LogOut className="h-[18px] w-[18px]" /></button>
    </div>
  </header>;
}
