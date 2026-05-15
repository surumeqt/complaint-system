import { useState } from 'react';
import { LayoutDashboard, FileText, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { LogoutModal } from '../components/LogoutModal';
import logo from '../assets/complaint-logo.png';
import SidebarItem from '../components/SidebarItemComponent';

export default function UserLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-200 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-24' : 'w-64'
        } fixed inset-y-0 left-0 z-50 flex flex-col bg-[#020617] border-r border-slate-800 transition-all duration-300 ease-in-out`}
      >
        {/* Logo Section - Adjusted padding and centering */}
        <div className={`relative flex items-center h-24 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <div className="flex items-center gap-3">
            <img src={logo} className="h-8 w-8 min-w-8 object-contain" alt="Logo" />
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-tight text-white animate-in fade-in duration-500">
                ResolveFlow
              </span>
            )}
          </div>
          
          {/* Collapse Toggle - Centered vertically to the logo area */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-full border-2 border-[#020617] shadow-lg shadow-indigo-500/40 transition-all"
          >
            {isCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>} 
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-3">
          <SidebarItem 
            to="/user/dashboard" 
            label="Dashboard" 
            isCollapsed={isCollapsed} 
            icon={<LayoutDashboard size={22} />} 
          />
          <SidebarItem 
            to="/user/my-complaints" 
            label="My Complaints"
            isCollapsed={isCollapsed} 
            icon={<FileText size={22} />} 
          />
          <SidebarItem 
            to="/user/complaints-details" 
            label="Complaint Details"
            isCollapsed={isCollapsed}
            icon={<FileText size={22} />}
          />
          <SidebarItem 
            to="/user/profile" 
            label="Profile Settings" 
            isCollapsed={isCollapsed} 
            icon={<User size={22} />} 
          />
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-800/50">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'px-4 gap-4'} py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 group`}
          >
            <span className="group-hover:scale-110 transition-transform">
              <LogOut size={22} />
            </span>
            {!isCollapsed && <span className="font-medium animate-in fade-in">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="mx-auto p-8">
          {children}
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />

    </div>
  );
}