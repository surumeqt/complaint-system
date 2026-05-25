import { useEffect, useState } from 'react';
import { BarChart3, Download, ShieldCheck, Info, ArrowUpRight, Activity } from 'lucide-react';
import { AdminService } from '../../core/services/admin.service';
import * as XLSX from 'xlsx';

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

  const handleExport = () => {
    if (categoryData.length === 0) return;

    // 1. Prepare the data (Mapping it to clean headers for Excel)
    const excelData = categoryData.map(cat => ({
      "Department/Category": cat.name,
      "Total Complaints": cat.total,
      "Percentage of Total": grandTotal > 0 
        ? `${((cat.total / grandTotal) * 100).toFixed(2)}%` 
        : "0%"
    }));

    // 2. Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 3. Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Report");

    // 4. Generate buffer and trigger download
    // File name includes current date for better record keeping
    const fileName = `Complaint_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const grandTotal = categoryData.reduce((sum, cat) => sum + cat.total, 0);

  if (loading) return <div className="p-20 text-center font-black text-indigo-500 animate-pulse uppercase tracking-[0.5em]">Analyzing Data Matrix...</div>;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Analytical Reports</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Global Departmental Metrics</p>
        </div>
        <div className="flex gap-4">
            <div className="hidden md:flex flex-col items-end justify-center px-6 border-r border-slate-800">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Load</span>
                <span className="text-xl font-mono text-white font-bold">{grandTotal}</span>
            </div>
            <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
              <Download size={14} />
              Export Ledger
            </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {categoryData.map((cat, idx) => {
          const percentage = grandTotal > 0 ? ((cat.total / grandTotal) * 100).toFixed(2) : "0.00";
          
          return (
            <div 
              key={idx} 
              className="relative group bg-slate-900/40 border border-slate-800 p-8 rounded-4xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
            >
              {/* Background Glow Effect */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-all" />
              
              <div className="relative flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                    <Activity size={18} className="text-indigo-500" />
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                    {percentage}%
                  </span>
                </div>

                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                
                <div className="mt-auto pt-6 border-t border-slate-800/50 flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-white tracking-tighter">{cat.total}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Total Resolved</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{cat.total}/{grandTotal}</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Contribution</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info / Logic Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="flex items-center gap-6 p-8 bg-slate-900/20 border border-slate-800 rounded-[2.5rem]">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Data Verification</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Metrics are aggregated in real-time. The <span className="text-indigo-400">Contribution</span> metric represents the category volume relative to the grand system total.
                </p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-8 bg-slate-900/20 border border-slate-800 rounded-[2.5rem]">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Info size={24} />
            </div>
            <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Top Statistical Driver</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="text-white font-bold">{categoryData[0]?.name || "N/A"}</span> is currently the primary source of complaints, accounting for <span className="text-white font-bold">{grandTotal > 0 ? ((categoryData[0]?.total / grandTotal) * 100).toFixed(1) : 0}%</span> of all activity.
                </p>
            </div>
          </div>
      </div>
    </div>
  );
}