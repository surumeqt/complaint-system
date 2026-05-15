import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  LogOut, 
  ShieldCheck, 
  Settings,
} from 'lucide-react';
import { LogoutModal } from '../components/LogoutModal';

export default function AdminLayout({ children }) {
  const [logoutModal, setLogoutModal] = useState(false);

  const linkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group
    ${isActive 
      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
    }
  `;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800 bg-[#020617] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-black tracking-tighter leading-none">RESOLVE<span className="text-indigo-500">FLOW</span></h1>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Admin Core</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-3">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/complaints" className={linkClass}>
            <Inbox size={20} />
            <span>Global Inbox</span>
          </NavLink>

          <NavLink to="/admin/reports" className={linkClass}>
            <BarChart3 size={20} />
            <span>System Reports</span>
          </NavLink>

          <NavLink to="/admin/settings" className={linkClass}>
            <Settings size={20} />
            <span>Configuration</span>
          </NavLink>
        </nav>

        <div className="p-6 border-t border-slate-900">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Root Access</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Termination Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        <main className="p-8">
          {children}
        </main>
      </div>
      <LogoutModal isOpen={logoutModal} onClose={() => setLogoutModal(false)} />
    </div>
  );
}