import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-text-main">
      <Navbar />

      {isLanding ? (
        <main className="flex-1">
          <Outlet />
          <Footer />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[calc(100%-16rem)]">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}
