import { useEffect, useState } from 'react';
import { 
  Search, Eye, Clock, CheckCircle2, 
  XCircle, Loader2, Send, ShieldAlert, X, Check 
} from 'lucide-react';
import { AdminService } from '../../core/services/admin.service';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await AdminService.getAllComplaints();
      if (res.success) setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      await AdminService.updateComplaintStatus(id, status);
      setComplaints(prev => prev.map(c => c.complaint_id === id ? { ...c, status } : c));
      if (selectedComplaint) setSelectedComplaint(prev => ({ ...prev, status }));
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!reply.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await AdminService.createResponseToComplaint(selectedComplaint.complaint_id, reply);
      if (res.success) {
        await handleStatusUpdate(selectedComplaint.complaint_id, 'resolved');
        setReply('');
        setSelectedComplaint(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      resolved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      rejected: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    };
    return `px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`;
  };

  return (
    <div className="space-y-6 relative">
      <header>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-indigo-500">Global Records</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
          System Monitoring: {complaints.length} Logs Active
        </p>
      </header>

      {/* Main Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 border-b border-slate-800">
            <tr>
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ticket</th>
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Content</th>
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {complaints.map((item) => (
              <tr key={item.complaint_id} className="hover:bg-indigo-500/5 transition-all">
                <td className="p-5">
                  <span className="text-xs font-mono text-indigo-400 font-bold block">#{item.complaint_id.split('-')[1]}</span>
                  <span className="text-[9px] text-slate-600 font-bold uppercase">{item.created_at}</span>
                </td>
                <td className="p-5">
                  <p className="text-sm font-bold text-white line-clamp-1">{item.title}</p>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{item.description}</p>
                </td>
                <td className="p-5">
                  <span className={getStatusBadge(item.status)}>{item.status.replace('_', ' ')}</span>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => setSelectedComplaint(item)}
                    className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl transition-all active:scale-90"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CENTERED MODAL --- */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#020617] border border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
               <div>
                  <span className={getStatusBadge(selectedComplaint.status)}>{selectedComplaint.status}</span>
                  <h2 className="text-xl font-black text-white mt-2 tracking-tight uppercase">Audit Record</h2>
               </div>
               <button 
                onClick={() => setSelectedComplaint(null)} 
                className="p-3 text-slate-500 hover:text-white bg-slate-900 border border-slate-800 rounded-2xl transition-colors"
               >
                  <X size={20} />
               </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-8 space-y-8 max-h-[70vh]">
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">User Submission</h3>
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
                  <h4 className="text-white font-bold text-lg mb-3">{selectedComplaint.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{selectedComplaint.description}</p>
                </div>
              </section>

              {/* Action Area */}
              <section className="space-y-6">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Protocol Management</h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Accept Button */}
                    <button 
                      onClick={() => handleStatusUpdate(selectedComplaint.complaint_id, 'in_progress')}
                      disabled={selectedComplaint.status !== 'pending' || isUpdatingStatus}
                      className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all group
                        ${selectedComplaint.status === 'in_progress' || selectedComplaint.status === 'resolved'
                          ? 'bg-blue-500/10 border-blue-500/30 opacity-50 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800'
                        }`}
                    >
                      <Clock className={selectedComplaint.status === 'in_progress' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {selectedComplaint.status === 'in_progress' ? 'Accepted' : 'Accept Ticket'}
                      </span>
                    </button>

                    {/* Reject / Complete Button */}
                    {selectedComplaint.status === 'in_progress' ? (
                      <button 
                        onClick={() => handleStatusUpdate(selectedComplaint.complaint_id, 'resolved')}
                        disabled={isUpdatingStatus}
                        className="flex flex-col items-center gap-3 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all group"
                      >
                        <Check className="text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Mark Complete</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(selectedComplaint.complaint_id, 'rejected')}
                        disabled={selectedComplaint.status !== 'pending' || isUpdatingStatus}
                        className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all group
                          ${selectedComplaint.status === 'rejected'
                            ? 'bg-rose-500/10 border-rose-500/30 opacity-50 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-800 hover:border-rose-500/50 hover:bg-slate-800'
                          }`}
                      >
                        <XCircle className={selectedComplaint.status === 'rejected' ? 'text-rose-400' : 'text-slate-500 group-hover:text-rose-400'} />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Reject Record</span>
                      </button>
                    )}
                </div>

                {/* Conditional Response Form */}
                {selectedComplaint.status === 'in_progress' && (
                  <form onSubmit={handleSubmitResponse} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <textarea 
                      placeholder="Input official resolution message..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full h-36 bg-slate-950 border border-slate-800 rounded-4xl p-6 text-white text-sm focus:border-indigo-500 outline-none transition-all resize-none font-medium"
                    />
                    <button 
                      disabled={isSubmitting || !reply.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-3xl text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                      Authorize Resolution
                    </button>
                  </form>
                )}

                {(selectedComplaint.status === 'rejected' || selectedComplaint.status === 'resolved') && (
                  <div className={`p-6 rounded-3xl border flex items-center gap-4 ${
                    selectedComplaint.status === 'resolved' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                  }`}>
                    {selectedComplaint.status === 'resolved' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Action Logged: This record is now {selectedComplaint.status}.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}