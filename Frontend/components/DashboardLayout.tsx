import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderTree, BookOpen, ShoppingBag, BarChart3,
  HelpCircle, LogOut, ChevronLeft, ChevronRight,
  Store, Users, Tags, User as UserIcon, Menu
} from 'lucide-react';
import { User, UserRole } from '../types';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  // ⬅️ default: desktop open, mobile close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Sellers', path: '/admin/sellers', icon: <Store size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Kategori', path: '/admin/categories', icon: <Tags size={20} /> },
  ];

  const sellerMenu = [
    { name: 'Dashboard', path: '/seller', icon: <LayoutDashboard size={20} /> },
    { name: 'Produk', path: '/seller/products', icon: <BookOpen size={20} /> },
    { name: 'Pesanan', path: '/seller/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Laporan', path: '/seller/reports', icon: <BarChart3 size={20} /> },
    { name: 'Help', path: '/seller/help', icon: <HelpCircle size={20} /> },
  ];

  const currentMenu =
    user.role === UserRole.SUPER_ADMIN ? adminMenu : sellerMenu;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ===== MOBILE BACKDROP ===== */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          bg-slate-900 flex flex-col shadow-xl
          transition-all duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          md:w-64 w-64
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-white font-bold text-xl tracking-tight">
            BookPoint
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <ChevronLeft />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {currentMenu.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-3 text-red-400
                       hover:bg-red-900/20 hover:text-red-300
                       rounded-xl transition"
          >
            <LogOut size={20} />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ===== NAVBAR ===== */}
        <header className="h-16 bg-white border-b border-slate-200
                           flex items-center justify-between px-4 md:px-8
                           shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg
                         hover:bg-slate-100"
            >
              <Menu size={22} />
            </button>

            <span className="text-slate-400">Halo,</span>
            <span className="font-semibold text-slate-800">
              {user.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Role
              </p>
              <p className="text-xs font-medium text-slate-700">
                {user.role.replace('_', ' ')}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100
                            flex items-center justify-center
                            border border-slate-200">
              <UserIcon size={18} />
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
