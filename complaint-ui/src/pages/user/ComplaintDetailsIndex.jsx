import { Search, Inbox, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

export default function ComplaintDetailsIndex() {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/user/complaints-details/${searchId.trim()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent" />
        
        <div className="relative z-10 space-y-8">
          {/* Icon Header */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <Inbox size={40} />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">No Record Selected</h1>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              Please select a complaint from your history logs or enter a specific Ticket ID below to access the encrypted details.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
            <input 
              type="text"
              placeholder="Enter Ticket ID (e.g. CMP-177...)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Actions */}
          <div className="pt-4 flex items-center justify-center gap-6">
             <Link 
              to="/user/my-complaints" 
              className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View My Logs
            </Link>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <Link 
              to="/user/dashboard" 
              className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
            >
              System Dashboard
            </Link>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}