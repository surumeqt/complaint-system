import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle2, XCircle, AlertCircle, UserCheck, ShieldAlert } from 'lucide-react';
import { ComplaintService } from '../../core/services/complaint.service';

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await ComplaintService.GetComplaintByComplaintId(id);
        if (response.success) {
          setComplaint(response.data);
        } else {
          setComplaint(null);
        }
      } catch (err) {
        console.error("Failed to fetch complaint details:", err);
        setComplaint(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const getStatusUI = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 size={16} /> };
      case 'pending':
        return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <Clock size={16} /> };
      case 'rejected':
        return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: <XCircle size={16} /> };
      default:
        return { color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: <AlertCircle size={16} /> };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-indigo-500 border-slate-800 animate-spin" />
          <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase">Accessing Encrypted Record...</span>
        </div>
      </div>
    );
  }

  // Enhanced "Empty or Not Found" State
  if (!id || !complaint) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-[100px] pointer-events-none" />
          
          <div className="relative inline-flex p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 mb-4">
            <ShieldAlert size={48} />
          </div>
          
          <div className="relative space-y-2">
            <h2 className="text-white text-3xl font-black tracking-tight">
              {!id ? "Invalid Access Protocol" : "Record Not Found"}
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
              {!id 
                ? "Direct access to the details terminal without a valid CID (Complaint ID) is prohibited." 
                : `The record for terminal ID #${id} could not be retrieved from the encrypted database.`
              }
            </p>
          </div>

          <div className="relative pt-4">
            <Link 
              to="/user/my-complaints" 
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
            >
              <ChevronLeft size={16} />
              Return to Logs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusUI = getStatusUI(complaint.status);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Navigation */}
      <Link 
        to="/user/my-complaints" 
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-all w-fit group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Protocol Overview</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-indigo-400 font-mono text-xs font-bold px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                #{complaint.complaint_id}
              </span>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-l border-slate-800 pl-3">
                Filed: {new Date(complaint.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">{complaint.title}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.15em]">
                {complaint.category_name} Department
              </p>
            </div>
          </div>
          
          <span className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${statusUI.color}`}>
            {statusUI.icon}
            {complaint.status}
          </span>
        </div>

        <div className="space-y-10 relative">
          {/* Visual Timeline Line */}
          <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-slate-800 via-slate-700 to-slate-800" />

          {/* User Section */}
          <div className="relative pl-12 group">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center z-10 group-hover:border-indigo-500 transition-colors" />
            <h4 className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Original Transmission</h4>
            <div className="bg-slate-950/50 p-7 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed text-sm shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AlertCircle size={40} />
                </div>
              {complaint.description}
            </div>
          </div>

          {/* Admin Response Section */}
          <div className="relative pl-12 group">
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center z-10 transition-all ${complaint.response ? 'bg-indigo-600 scale-110 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 border-slate-700'}`}>
                {complaint.response && <UserCheck size={12} className="text-white" />}
            </div>
            
            <h4 className="text-indigo-400 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Official Administrative Response</h4>
            
            {complaint.response ? (
              <div className="space-y-4">
                <div className="bg-indigo-500/5 p-7 rounded-2xl border border-indigo-500/20 text-slate-200 leading-relaxed text-sm shadow-xl backdrop-blur-sm">
                  <p className="italic">"{complaint.response}"</p>
                  
                  <div className="mt-6 pt-6 border-t border-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                            {complaint.admin_name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] text-indigo-400/50 font-black uppercase tracking-widest">Authorized Personnel</p>
                            <p className="text-xs text-white font-bold">{complaint.admin_name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Timestamp</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                            {new Date(complaint.replied_at).toLocaleString()}
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/30 p-8 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center gap-3">
                <div className="p-3 bg-slate-900 rounded-xl text-slate-600">
                    <Clock size={24} className="animate-pulse" />
                </div>
                <p className="text-slate-500 text-xs italic font-medium max-w-xs">
                  This report is currently being processed by the administrative department. Please check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}