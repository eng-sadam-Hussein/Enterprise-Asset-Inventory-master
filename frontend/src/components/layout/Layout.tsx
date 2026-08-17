import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-[#f5f7fb]">
    <Sidebar mobileOpen={open} onCloseMobile={() => setOpen(false)} />
    <div className="min-h-screen lg:pl-[248px]">
      <Navbar onMenuClick={() => setOpen(true)} />
      <main className="px-3 py-4 sm:px-6 sm:py-5 lg:px-6 lg:py-5">
        <div className="mx-auto max-w-[1540px]"><Outlet /></div>
      </main>
    </div>
  </div>;
}
