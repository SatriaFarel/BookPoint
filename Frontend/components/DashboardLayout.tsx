
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderTree, BookOpen, ShoppingBag, BarChart3, HelpCircle, LogOut, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminMenu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  ];

  const sellerMenu = [
    { name: 'Dashboard', path: '/seller', icon: <LayoutDashboard size={20} /> },
    { name: 'Kategori', path: '/seller/categories', icon: <FolderTree size={20} /> },
    { name: 'Produk', path: '/seller/products', icon: <BookOpen size={20} /> },
    { name: 'Pesanan', path: '/seller/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Laporan', path: '/seller/reports', icon: <BarChart3 size={20} /> },
    { name: 'Help', path: '/seller/help', icon: <HelpCircle size={20} /> },
  ];

  const currentMenu = user.role === UserRole.SUPER_ADMIN ? adminMenu : sellerMenu;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col no-print z-20 shadow-xl`}
      >
        <div className="p-6 flex items-center justify-between overflow-hidden">
          <h1 className={`text-white font-bold text-xl tracking-tight transition-all duration-300 ${!isSidebarOpen ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'}`}>Lumina</h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300">{item.name}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
            onClick={onLogout}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-colors group relative"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300">Logout</span>}
            {!isSidebarOpen && (
              <div className="absolute left-16 bg-red-900 text-white text-xs py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 no-print shadow-sm">
          <div className="flex items-center">
             <span className="text-slate-400 mr-2">Halo,</span>
             <span className="font-semibold text-slate-800">{user.name}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Role</p>
                <p className="text-xs font-medium text-slate-700">{user.role.replace('_', ' ')}</p>
             </div>
             <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                <UserIcon size={18} />
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
