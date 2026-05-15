import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, label, icon, isCollapsed }) => {
  return (
    <NavLink
      to={to} 
      className={({ isActive }) => `
        flex items-center rounded-xl transition-all duration-200 group py-3
        ${isCollapsed ? 'justify-center' : 'px-4 gap-4'}
        ${isActive 
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
      `}
    >
      <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2">
          {label}
        </span>
      )}
    </NavLink>
  );
}

export default SidebarItem;