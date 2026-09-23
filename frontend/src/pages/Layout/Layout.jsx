import React, { useState } from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onMenuClick={() => setMobileOpen((prev) => !prev)} />

      <div className="relative flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onClose={() => setMobileOpen(false)} />
        </div>

        {mobileOpen && (
          <button
            type="button"
            aria-label="Close mobile menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          />
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;