import { useEffect, useRef, useState } from 'react';
import { Database, Download, FileText, RefreshCcw, Settings2, ShieldCheck, Upload, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { useWorkspace } from '../context/WorkspaceContext';

const WORKSPACE_KEY = 'nexora_assetops_workspace_v5';

function formatBytes(bytes = 0) {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function SettingsPage() {
  const { data, resetWorkspace } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const [storage, setStorage] = useState<{ usage?: number; quota?: number }>({});

  useEffect(() => {
    navigator.storage?.estimate?.().then((estimate) => setStorage({ usage: estimate.usage, quota: estimate.quota })).catch(() => undefined);
  }, []);

  const exportWorkspace = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nexora-assetops-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Workspace backup downloaded.');
  };

  const importWorkspace = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed?.assets) || !Array.isArray(parsed?.stock) || !Array.isArray(parsed?.users)) throw new Error('Invalid Nexora workspace backup.');
      parsed.metadata = { ...(parsed.metadata || {}), version: 5, company: 'Nexora Technologies' };
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(parsed));
      toast.success('Backup imported. Reloading workspace…');
      window.setTimeout(() => window.location.reload(), 550);
    } catch (error: any) {
      toast.error(error?.message || 'Could not import this backup.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const restore = () => {
    if (!window.confirm('Restore the original professional portfolio dataset? Your current local changes will be replaced.')) return;
    resetWorkspace();
  };

  const dataSize = new Blob([JSON.stringify(data)]).size;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-head">
        <div><p className="eyebrow">Workspace administration</p><h1 className="page-title">System Settings</h1><p className="page-subtitle">Manage local-first storage, portable backups and portfolio workspace recovery without depending on a live backend.</p></div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#b8eee9] bg-[#eefcf9] px-3 py-2 text-[11px] font-bold text-[#08796f]"><WifiOff className="h-4 w-4" /> Offline-ready mode active</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="mini-stat"><span>Workspace version</span><b>v5.0</b></div>
        <div className="mini-stat"><span>Current JSON dataset</span><b>{formatBytes(dataSize)}</b></div>
        <div className="mini-stat"><span>Browser storage used</span><b>{storage.usage ? formatBytes(storage.usage) : 'Available'}</b></div>
        <div className="mini-stat"><span>Storage quota</span><b>{storage.quota ? formatBytes(storage.quota) : 'Browser managed'}</b></div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <section className="panel">
          <div className="panel-head"><div><p className="panel-kicker">Data portability</p><h2 className="panel-title">Backup & restore</h2></div><Download className="h-5 w-5 text-[#0D47A1]" /></div>
          <p className="mt-2 max-w-2xl text-[11px] leading-5 text-slate-500">Export all assets, inventory, users, assignments, maintenance records and activity history into one portable JSON backup. Import it later on the same or another browser.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button onClick={exportWorkspace} className="rounded-[18px] border border-slate-200 bg-white p-4 text-left transition hover:border-[#bad4ff] hover:shadow-md">
              <div className="flex items-center justify-between"><span className="rounded-xl bg-[#eaf2ff] p-2.5 text-[#0D47A1]"><Download className="h-4 w-4" /></span><FileText className="h-4 w-4 text-slate-300" /></div>
              <p className="mt-3 text-[12px] font-extrabold text-slate-900">Download workspace backup</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Create a portable snapshot of the current browser dataset.</p>
            </button>
            <button onClick={() => inputRef.current?.click()} className="rounded-[18px] border border-slate-200 bg-white p-4 text-left transition hover:border-[#9be3dc] hover:shadow-md">
              <div className="flex items-center justify-between"><span className="rounded-xl bg-[#e8fbf8] p-2.5 text-[#08796f]"><Upload className="h-4 w-4" /></span><Database className="h-4 w-4 text-slate-300" /></div>
              <p className="mt-3 text-[12px] font-extrabold text-slate-900">Import workspace backup</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Restore a previously exported Nexora JSON workspace.</p>
            </button>
            <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => importWorkspace(event.target.files?.[0])} />
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><div><p className="panel-kicker">Portfolio recovery</p><h2 className="panel-title">Professional seeded dataset</h2></div><RefreshCcw className="h-5 w-5 text-[#FF8C00]" /></div>
          <div className="mt-4 rounded-[18px] border border-[#ffe0b8] bg-[#fff8ef] p-4">
            <p className="text-[12px] font-extrabold text-slate-900">Restore showcase content</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-600">Return the application to its original portfolio-ready dataset after testing create, update, delete, stock movement or assignments.</p>
            <div className="mt-4"><Button onClick={restore} variant="secondary" icon={<RefreshCcw className="h-4 w-4" />}>Restore original workspace</Button></div>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-[#b8eee9] bg-[#eefcf9] p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#08796f]" /><div><p className="text-[11px] font-extrabold text-[#075e57]">Local-first architecture</p><p className="mt-1 text-[10px] leading-4 text-[#33766f]">The portfolio deployment remains fully interactive on Vercel even when the optional Spring Boot API and PostgreSQL database are not running.</p></div></div>
        </section>
      </div>

      <section className="panel p-4">
        <div className="flex items-start gap-3"><Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D47A1]" /><div><h2 className="text-[12px] font-extrabold text-slate-900">Production architecture note</h2><p className="mt-1 max-w-4xl text-[10px] leading-5 text-slate-500">This portfolio build uses LocalStorage as a resilient client-side data adapter for public demonstration. The repository also contains the backend and database implementation so the same product can be connected to server-side persistence for production environments.</p></div></div>
      </section>
    </div>
  );
}
