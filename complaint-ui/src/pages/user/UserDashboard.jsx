import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, ArrowUpRight, Activity, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserService } from '../../core/services/user.service';
import useAuth from '../../core/hooks/useAuth';

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: null, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await UserService.getUserDashboardStats();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    { label: "Total Complaints", value: data.stats?.total || "0", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Pending Review", value: data.stats?.pending || "0", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Resolved", value: data.stats?.resolved || "0", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Welcome back, {user?.name}. Node status: Operational.
          </p>
        </div>
        <Link to="/user/my-complaints" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
          New Complaint
          <ArrowUpRight size={16} />
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
              <stat.icon size={100} />
            </div>
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <h3 className="text-4xl font-black text-white mt-2">
                {loading ? "..." : stat.value.toString().padStart(2, '0')}
            </h3>
          </Motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={20} className="text-indigo-400" />
              Recent Logs
            </h2>
            <Link to="/user/my-complaints" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">
              View All
            </Link>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            {data.recent.length > 0 ? (
              <div className="divide-y divide-slate-800/50">
                {data.recent.map((item) => (
                  <Link key={item.complaint_id} to={`/user/complaints-details/${item.complaint_id}`} className="flex items-center justify-between p-5 hover:bg-slate-800/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-0.5">{item.category_name} • {item.complaint_id}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-slate-600">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-600 text-sm italic">
                No recent activity detected.
              </div>
            )}
          </div>
        </div>

        {/* Informational Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
            <Bell className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 rotate-12" />
            <h4 className="text-lg font-bold mb-2">Security Notice</h4>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">
              Your reports are protected using ResolveFlow AES-256 encryption. Only authorized personnel can access the contents of your tickets.
            </p>
            <button className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}