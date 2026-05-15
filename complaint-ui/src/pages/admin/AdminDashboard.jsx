import { useEffect, useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { AdminService } from '../../core/services/admin.service';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statusRes, complaintsRes] = await Promise.all([
          AdminService.getResolutionStatus(),
          AdminService.getAllComplaints()
        ]);

        if (statusRes.success) setStats(statusRes.data);
        if (complaintsRes.success) setRecentComplaints(complaintsRes.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Helper to find count by status safely
  const getCount = (statusName) => {
    return stats.find(s => s.status === statusName)?.count || 0;
  };

  const totalComplaints = stats.reduce((acc, curr) => acc + curr.count, 0);

  if (loading) return <div className="p-20 text-center font-black text-indigo-500 animate-pulse tracking-widest">INITIALIZING SYSTEMS...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">System Overview</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Real-time resolution metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Records" 
          value={totalComplaints} 
          icon={<Activity className="text-indigo-400" />} 
          color="indigo" 
        />
        <StatCard 
          label="Resolved" 
          value={getCount('resolved')} 
          icon={<CheckCircle2 className="text-emerald-400" />} 
          color="emerald" 
        />
        <StatCard 
          label="Pending" 
          value={getCount('pending')} 
          icon={<Clock className="text-amber-400" />} 
          color="amber" 
        />
        <StatCard 
          label="In Progress" 
          value={getCount('in_progress')} 
          icon={<TrendingUp className="text-blue-400" />} 
          color="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simplified Resolution Chart Placeholder */}
        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-4xl p-8 flex flex-col justify-between">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Resolution Distribution</h3>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Simple Visual representation using Tailwind circles if you don't have a chart lib yet */}
            <div className="w-40 h-40 rounded-full border-12 border-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-black text-white">{totalComplaints > 0 ? Math.round((getCount('resolved') / totalComplaints) * 100) : 0}%</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Efficiency</p>
                </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
             <LegendItem color="bg-emerald-500" label="Resolved" count={getCount('resolved')} />
             <LegendItem color="bg-amber-500" label="Pending" count={getCount('pending')} />
             <LegendItem color="bg-rose-500" label="Rejected" count={getCount('rejected')} />
          </div>
        </div>

        {/* Recent Traffic */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-4xl p-8">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Transmissions</h3>
             <ArrowUpRight size={16} className="text-slate-600" />
          </div>
          <div className="space-y-4">
            {recentComplaints.map((c) => (
              <div key={c.complaint_id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${c.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{c.title}</p>
                    <p className="text-[10px] text-slate-600 font-mono uppercase">#{c.complaint_id.split('-')[1]}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    indigo: "shadow-indigo-500/5 border-indigo-500/10",
    emerald: "shadow-emerald-500/5 border-emerald-500/10",
    amber: "shadow-amber-500/5 border-amber-500/10",
    blue: "shadow-blue-500/5 border-blue-500/10"
  };

  return (
    <div className={`bg-slate-900/40 border rounded-3xl p-6 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1 ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{label}</p>
    </div>
  );
}

function LegendItem({ color, label, count }) {
    return (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 text-slate-400">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                {label}
            </div>
            <span className="text-white">{count}</span>
        </div>
    )
}