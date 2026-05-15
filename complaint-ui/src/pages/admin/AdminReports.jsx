import { useEffect, useState } from 'react';
import { BarChart3, Download, ShieldCheck, Info } from 'lucide-react';
import { AdminService } from '../../core/services/admin.service';

export default function AdminReports() {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await AdminService.getCategoryReport();
        if (res.success) {
          const sorted = [...res.data].sort((a, b) => b.total - a.total);
          setCategoryData(sorted);
        }
      } catch (err) {
        console.error("Report Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const maxTotal = Math.max(...categoryData.map(c => c.total), 1);

  if (loading) return <div className="p-20 text-center font-black text-indigo-500 animate-pulse uppercase tracking-[0.5em]">Analyzing Data Matrix...</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Analytical Reports</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Cross-departmental complaint metrics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-800 transition-all">
          <Download size={14} />
          Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Category Breakdown Chart */}
        <div className="xl:col-span-3 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-indigo-500" size={20} />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Volume by Department</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
              Total Categories: {categoryData.length}
            </span>
          </div>

          <div className="space-y-6">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-2 px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs font-mono text-white font-bold">{cat.total}</span>
                </div>
                {/* Custom Tech-Bar */}
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex p-0.5">
                  <div 
                    className="h-full bg-linear-to-r from-indigo-600 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    style={{ width: `${(cat.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-4xl p-8">
            <div className="flex items-center gap-3 text-indigo-400 mb-4">
              <ShieldCheck size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Integrity Report</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Category data is calculated from decrypted headers. No personal user data is exposed during this aggregation.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-4xl p-8">
             <div className="flex items-center gap-3 text-slate-500 mb-4">
                <Info size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Top Issue</h4>
             </div>
             <div className="mt-2">
                <p className="text-xl font-black text-white truncate">
                  {categoryData[0]?.total > 0 ? categoryData[0].name : "No Data"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Currently requires highest priority.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}