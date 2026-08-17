import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  AtSign,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SHOWCASE_USERS } from '../data/seed';
import { COMPANY } from '../constants/brand';

const slides = [
  {
    image: '/login/nexora-building-1.webp',
    eyebrow: 'Nexora Operations Center',
    title: 'Every asset. One clear operational view.',
    copy: 'Track ownership, custody, condition, location and lifecycle activity from one fast and practical workspace.',
  },
  {
    image: '/login/nexora-building-2.webp',
    eyebrow: 'Inventory & Custody',
    title: 'Control stock movement without spreadsheet chaos.',
    copy: 'Receive, issue, assign and return business resources with a traceable history that stays available in the browser.',
  },
  {
    image: '/login/nexora-building-3.webp',
    eyebrow: 'Maintenance & Reporting',
    title: 'Keep critical equipment ready for work.',
    copy: 'Coordinate maintenance, spot risks and export useful operational reports with role-based access for every team.',
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [slide, setSlide] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), 5200);
    return () => clearInterval(id);
  }, []);

  const current = slides[slide];
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (isAuthenticated) return <Navigate to={from} replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      toast.error('Enter your username and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(username, password);
      toast.success(`Welcome to ${COMPANY.productName}`);
    } catch (error: any) {
      toast.error(error?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const chooseUser = (user: (typeof SHOWCASE_USERS)[number]) => {
    setUsername(user.username);
    setPassword(user.password || '');
  };

  return (
    <div className="min-h-screen bg-[#06162f] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-16px)] max-w-[1680px] overflow-hidden rounded-[24px] bg-white shadow-[0_34px_90px_rgba(1,12,31,.46)] sm:min-h-[calc(100vh-24px)] sm:rounded-[30px] lg:min-h-[calc(100vh-32px)] lg:grid-cols-[1.04fr_.96fr]">
        <section className="relative hidden min-h-[700px] overflow-hidden bg-[#071a39] lg:flex">
          {slides.map((item, index) => (
            <img
              key={item.image}
              src={item.image}
              alt={`${COMPANY.productName} corporate facility ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${index === slide ? 'scale-100 opacity-100' : 'scale-[1.025] opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,42,.20),rgba(4,18,42,.20)_36%,rgba(4,18,42,.94)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#06152e]/80 to-transparent" />

          <div className="absolute left-7 top-7 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#071a39]/55 px-4 py-3 backdrop-blur-xl xl:left-9 xl:top-9">
            <img src={COMPANY.logoWhite} className="h-11 w-11" alt="Nexora logo" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#62dfd4]">Nexora</p>
              <p className="text-base font-extrabold tracking-[-.02em] text-white">AssetOps</p>
            </div>
          </div>

          <div className="relative z-10 mt-auto w-full p-7 xl:p-10 2xl:p-12">
            <div className="max-w-[650px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#9af0e8] backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-[#ffad43]" />
                {current.eyebrow}
              </span>
              <h1 className="mt-4 max-w-2xl text-[38px] font-extrabold leading-[1.06] tracking-[-.045em] text-white xl:text-[46px]">
                {current.title}
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-6 text-slate-200 xl:text-[15px]">{current.copy}</p>
            </div>

            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${index === slide ? 'w-10 bg-[#ff9a1f]' : 'w-5 bg-white/35 hover:bg-white/60'}`}
                    aria-label={`Show building slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSlide((slide + slides.length - 1) % slides.length)}
                  className="rounded-full border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-xl transition hover:bg-white/20"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlide((slide + 1) % slides.length)}
                  className="rounded-full border border-white/15 bg-white/10 p-2.5 text-white backdrop-blur-xl transition hover:bg-white/20"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[radial-gradient(circle_at_100%_0%,rgba(17,181,166,.10),transparent_30%),radial-gradient(circle_at_0%_100%,rgba(255,140,0,.08),transparent_33%)] px-4 py-5 sm:px-7 sm:py-7 lg:px-10 xl:px-12">
          <div className="w-full max-w-[540px]">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <img src={COMPANY.logoFull} className="h-10 w-10" alt="Nexora logo" />
                <div>
                  <p className="font-extrabold tracking-[-.02em] text-slate-950">Nexora AssetOps</p>
                  <p className="text-xs font-medium text-slate-500">Enterprise asset operations</p>
                </div>
              </div>
              <span className="rounded-full bg-[#eafaf8] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#08796f]">Local-first</span>
            </div>

            <div className="relative mb-5 overflow-hidden rounded-[22px] bg-[#06162f] shadow-lg lg:hidden">
              <img src={current.image} alt="Nexora building" className="h-40 w-full object-cover sm:h-48" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06162f]/95 via-[#06162f]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#9af0e8]">{current.eyebrow}</p>
                <p className="mt-1 max-w-[90%] text-base font-extrabold leading-tight text-white">{current.title}</p>
                <div className="mt-2.5 flex gap-1.5">
                  {slides.map((_, index) => (
                    <button key={index} type="button" onClick={() => setSlide(index)} className={`h-1 rounded-full ${index === slide ? 'w-8 bg-[#ff9a1f]' : 'w-4 bg-white/35'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eafaf8] px-3 py-1.5 text-[10px] font-extrabold text-[#08796f]">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure role-based workspace
              </div>
              <h2 className="text-[29px] font-extrabold tracking-[-.045em] text-[#07152f] sm:text-[34px]">Welcome back</h2>
              <p className="mt-1.5 max-w-lg text-[13px] leading-[22px] text-slate-500">
                Sign in to manage assets, inventory, assignments, maintenance and operational reporting from one responsive workspace.
              </p>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-600">Username</span>
                <div className="relative">
                  <AtSign className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#0D47A1]" />
                  <input
                    className="login-input pl-[46px] pr-4"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-600">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#0D47A1]" />
                  <input
                    className="login-input pl-[46px] pr-[48px]"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0D47A1]">
                    {show ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}
                  </button>
                </div>
              </label>

              <button
                disabled={submitting || isLoading}
                className="group flex h-[48px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#0D47A1] px-5 text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(13,71,161,.20)] transition hover:-translate-y-0.5 hover:bg-[#0a3b87] disabled:translate-y-0 disabled:opacity-60"
              >
                {submitting || isLoading ? 'Signing in…' : 'Sign in to workspace'}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-5 rounded-[20px] border border-slate-200 bg-slate-50/80 p-3.5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-extrabold text-[#07152f]">Portfolio access directory</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Use any account below to explore its permitted workspace areas.</p>
                </div>
                <div className="rounded-xl bg-[#fff5e9] p-2 text-[#e87700]">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                {SHOWCASE_USERS.map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    onClick={() => chooseUser(user)}
                    className={`grid w-full gap-2 rounded-[14px] border bg-white px-3 py-2.5 text-left transition sm:grid-cols-[1.05fr_.95fr_.9fr] sm:items-center ${username === user.username ? 'border-[#11B5A6] shadow-[0_0_0_3px_rgba(17,181,166,.08)]' : 'border-slate-200 hover:border-[#9be3dc] hover:shadow-sm'}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-slate-900">@{user.username}</p>
                      <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[.08em] text-slate-400">Username</p>
                    </div>
                    <div className="min-w-0 sm:border-l sm:border-slate-100 sm:pl-3">
                      <p className="text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">Password</p>
                      <p className="mt-0.5 truncate font-mono text-[10px] font-bold text-slate-700">{user.password}</p>
                    </div>
                    <div className="min-w-0 sm:border-l sm:border-slate-100 sm:pl-3">
                      <p className="text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">Department</p>
                      <p className="mt-0.5 truncate text-[10px] font-bold text-slate-700">{user.department || 'General'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center border-t border-slate-200 pt-3.5">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[#0D47A1]/10 bg-[#f5f9ff] px-4 py-2 text-center shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Developed by</span>
                <span className="text-[11px] font-extrabold text-[#0D47A1]">Saiman Hussein Mohamed</span>
                <span className="hidden h-1 w-1 rounded-full bg-[#ff8c00] sm:block" />
                <span className="text-[10px] font-bold text-[#e87700]">Freelancer on Upwork</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
