import { useMemo, useRef, useState } from 'react';
import { Camera, KeyRound, Pencil, Plus, Search, ShieldCheck, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import type { CreateUserRequest, ManagedUser, Role } from '../api/types';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERMISSIONS } from '../utils/permissions';
import { formatDate } from '../utils/format';

const roles = Object.keys(ROLE_LABELS) as Role[];
const empty: CreateUserRequest = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  department: 'Operations',
  role: 'AUDITOR',
  jobTitle: '',
  profileImage: '',
};

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

async function compressProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Choose a JPG, PNG or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Profile photo must be smaller than 5 MB.');

  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read this image.'));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not process this image.'));
    img.src = source;
  });

  const canvas = document.createElement('canvas');
  const size = 520;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return source;

  const scale = Math.max(size / image.width, size / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
  return canvas.toDataURL('image/webp', 0.82);
}

function Avatar({ user, size = 'md' }: { user: Pick<ManagedUser, 'fullName' | 'profileImage'>; size?: 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'h-20 w-20 rounded-[24px] text-lg' : 'h-10 w-10 rounded-[13px] text-[10px]';
  if (user.profileImage) return <img src={user.profileImage} alt={user.fullName} className={`${cls} shrink-0 object-cover ring-1 ring-slate-200`} />;
  return <div className={`${cls} grid shrink-0 place-items-center bg-[#07152f] font-extrabold text-white`}>{initials(user.fullName)}</div>;
}

export default function UsersPage() {
  const { user: me } = useAuth();
  const { data, addUser, updateUser, deleteUser } = useWorkspace();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<CreateUserRequest>(empty);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(
    () => data.users.filter((user) => !search || `${user.username} ${user.fullName} ${user.email} ${user.department} ${ROLE_LABELS[user.role]}`.toLowerCase().includes(search.toLowerCase())),
    [data.users, search],
  );

  const launch = (user?: ManagedUser) => {
    if (user) {
      setEditing(user);
      setForm({
        username: user.username,
        email: user.email,
        password: '',
        fullName: user.fullName,
        department: user.department || '',
        role: user.role,
        jobTitle: user.jobTitle || '',
        profileImage: user.profileImage || '',
      });
    } else {
      setEditing(null);
      setForm({ ...empty });
    }
    setOpen(true);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!form.username || !form.fullName || !form.email) throw new Error('Username, full name and email are required.');
      if (!editing && !form.password) throw new Error('Password is required.');
      editing
        ? updateUser(editing.id, {
            email: form.email,
            fullName: form.fullName,
            department: form.department,
            role: form.role,
            password: form.password || undefined,
            jobTitle: form.jobTitle,
            active: true,
            profileImage: form.profileImage,
          })
        : addUser(form);
      toast.success(editing ? 'User access updated' : 'User account created');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const choosePhoto = async (file?: File) => {
    if (!file) return;
    setPhotoBusy(true);
    try {
      const profileImage = await compressProfilePhoto(file);
      setForm((current) => ({ ...current, profileImage }));
      toast.success('Profile photo ready');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPhotoBusy(false);
      if (photoRef.current) photoRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="page-head">
        <div>
          <p className="eyebrow">Identity & permissions</p>
          <h1 className="page-title">Access Control</h1>
          <p className="page-subtitle">Manage workspace identities, profile photos and role-based permissions even when the public portfolio runs frontend-only.</p>
        </div>
        <Button onClick={() => launch()} icon={<Plus className="h-4 w-4" />}>Create user</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {roles.map((role) => (
          <div key={role} className="mini-stat">
            <span>{ROLE_LABELS[role]}</span>
            <b>{data.users.filter((user) => user.role === role).length}</b>
          </div>
        ))}
      </div>

      <div className="panel p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users, departments, roles or email…" />
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[22px] border border-slate-200 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="pro-table">
            <thead><tr><th>User</th><th>Role</th><th>Department</th><th>Job title</th><th>Portfolio password</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {rows.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <div>
                        <p className="font-extrabold text-slate-900">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400">@{user.username} · {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="soft-badge">{ROLE_LABELS[user.role]}</span></td>
                  <td>{user.department || '—'}</td>
                  <td>{user.jobTitle || '—'}</td>
                  <td><code className="rounded-lg bg-[#eef5ff] px-2 py-1 text-[11px] font-bold text-[#0D47A1]">{user.password || '••••••••'}</code></td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button className="icon-btn" onClick={() => launch(user)} aria-label={`Edit ${user.fullName}`}><Pencil className="h-4 w-4" /></button>
                      <button
                        className="icon-btn danger"
                        disabled={user.id === me?.id}
                        onClick={() => {
                          if (confirm(`Delete @${user.username}?`)) {
                            try { deleteUser(user.id); toast.success('User removed'); } catch (error: any) { toast.error(error.message); }
                          }
                        }}
                        aria-label={`Delete ${user.fullName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((user) => (
          <article key={user.id} className="panel p-4">
            <div className="flex items-start gap-3">
              <Avatar user={user} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold text-[#07152f]">{user.fullName}</p>
                <p className="truncate text-xs text-slate-500">@{user.username} · {user.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5"><span className="soft-badge">{ROLE_LABELS[user.role]}</span><span className="soft-badge">{user.department || 'No department'}</span></div>
              </div>
              <button className="icon-btn" onClick={() => launch(user)}><Pencil className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-xs">
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job title</p><p className="mt-1 font-semibold text-slate-700">{user.jobTitle || '—'}</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</p><code className="mt-1 block truncate font-bold text-[#0D47A1]">{user.password || '••••••••'}</code></div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {roles.map((role) => (
          <article key={role} className="panel">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-[#eafaf8] p-3"><ShieldCheck className="h-5 w-5 text-[#08796f]" /></div>
              <span className="text-xs font-extrabold text-[#0D47A1]">{ROLE_PERMISSIONS[role].length} grants</span>
            </div>
            <h3 className="mt-4 font-extrabold text-[#07152f]">{ROLE_LABELS[role]}</h3>
            <p className="mt-2 min-h-[60px] text-xs leading-5 text-slate-500">{ROLE_DESCRIPTIONS[role]}</p>
            <div className="mt-4 border-t pt-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Permissions</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-600">{ROLE_PERMISSIONS[role].map((permission) => permission.replace('.read', '').replace('.write', ' edit').replace('.manage', ' admin')).join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Update @${editing.username}` : 'Create workspace user'} size="lg">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <Avatar user={{ fullName: form.fullName || 'New User', profileImage: form.profileImage }} size="lg" />
                <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#FF8C00] text-white"><Camera className="h-3.5 w-3.5" /></span>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="font-extrabold text-[#07152f]">Profile photo</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Upload a JPG, PNG or WebP. It is resized automatically and saved with the user profile in LocalStorage.</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => choosePhoto(event.target.files?.[0])} />
                  <button type="button" disabled={photoBusy} onClick={() => photoRef.current?.click()} className="btn btn-secondary btn-sm">
                    <Upload className="h-3.5 w-3.5" /> {photoBusy ? 'Processing…' : form.profileImage ? 'Change photo' : 'Upload photo'}
                  </button>
                  {form.profileImage && <button type="button" onClick={() => setForm((current) => ({ ...current, profileImage: '' }))} className="btn btn-ghost btn-sm">Remove</button>}
                </div>
              </div>
            </div>
          </div>

          <label><span className="label">Username</span><input className="input" disabled={Boolean(editing)} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="e.g. procurement" /></label>
          <label><span className="label">Full name</span><input className="input" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Full staff name" /></label>
          <label><span className="label">Email</span><input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label><span className="label">Department</span><input className="input" value={form.department || ''} onChange={(event) => setForm({ ...form, department: event.target.value })} /></label>
          <label><span className="label">Job title</span><input className="input" value={form.jobTitle || ''} onChange={(event) => setForm({ ...form, jobTitle: event.target.value })} /></label>
          <label><span className="label">Role</span><select className="input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}>{roles.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}</select></label>
          <label className="sm:col-span-2">
            <span className="label">{editing ? 'New password (leave blank to keep current)' : 'Password'}</span>
            <div className="relative"><KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-10" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
          </label>
          <div className="sm:col-span-2 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save access profile</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
