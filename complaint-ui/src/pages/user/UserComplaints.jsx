import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, ArrowRight, 
  Clock, Send, X, FileText, ChevronDown, CheckCircle2, AlertCircle, Paperclip
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useUserService from '../../core/hooks/useUserService';
import useAuth from '../../core/hooks/useAuth';
import { ComplaintService } from '../../core/services/complaint.service';
import ToastModal from '../../components/ToastModal';

export default function UserComplaints() {
  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Toast State
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  
  // Data States
  const [complaints, setComplaints] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: ''
  });

  const { user } = useAuth();
  const { getComplaintsByUser, loading } = useUserService();

  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 size={12} /> };
      case 'pending':
        return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <Clock size={12} /> };
      case 'rejected':
        return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: <X size={12} /> };
      default:
        return { color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: <AlertCircle size={12} /> };
    }
  };

  useEffect(() => {
    const initPage = async () => {
      if (user?.id) {
        const data = await getComplaintsByUser(user.id);
        setComplaints(data || []);
        try {
          const catRes = await ComplaintService.GetAllCategories();
          setDbCategories(catRes.data);
          if (catRes.data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: catRes.data[0].category_id }));
          }
        } catch (err) {
          console.error("Failed to load categories", err);
        }
      }
    };
    initPage();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use FormData for file uploads
    const data = new FormData();
    data.append('category_id', formData.category_id);
    data.append('title', formData.title);
    data.append('description', formData.description);
    
    // Append multiple files
    selectedFiles.forEach((file) => {
      data.append('attachments[]', file);
    });

    try {
      // Note: Pass 'data' instead of a raw object
      const response = await ComplaintService.CreateComplaint(data);

      if (response.success) {
        setIsFormOpen(false);
        setFormData({ category_id: dbCategories[0]?.category_id, title: '', description: '' });
        setSelectedFiles([]); // Clear files
        
        setToast({
          isVisible: true,
          message: "Complaint filed successfully!",
          type: "success"
        });
        
        const updated = await getComplaintsByUser(user.id);
        setComplaints(updated || []);
      }
    } catch (err) {
      setToast({
        isVisible: true,
        message: "Upload failed: " + err.message,
        type: "error"
      });
    }
  };
  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'All' || c.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.complaint_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <ToastModal {...toast} onClose={() => setToast({ ...toast, isVisible: false })} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Complaints</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor your reported issues in real-time.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={20} /> File New Complaint
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Reference ID..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
          {['All', 'Pending', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/60 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-6 py-5 font-bold">Reference Id</th>
              <th className="px-6 py-5 font-bold">Details</th>
              <th className="px-6 py-5 font-bold text-center">Status</th>
              <th className="px-6 py-5">Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
               <tr><td colSpan="4" className="text-center py-10 text-slate-500 animate-pulse">Decrypting Protocol Data...</td></tr>
            ) : filteredComplaints.length > 0 ? (
              filteredComplaints.map((item) => {
                const status = getStatusDetails(item.status);
                return (
                  <tr key={item.complaint_id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="px-6 py-6">
                      <span className="font-mono text-indigo-400 text-sm font-bold">#{item.complaint_id.split('-')[1]}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-indigo-500 font-bold uppercase mb-1">{item.category_name}</span>
                        <span className="text-slate-200 font-medium line-clamp-1">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.color}`}>
                          {status.icon} {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Link to={`/user/complaints-details/${item.complaint_id}`} className="text-slate-600 hover:text-indigo-400 transition-colors inline-block transform hover:translate-x-1 duration-200">
                        <ArrowRight size={20} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4" className="text-center py-10 text-slate-500">No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <Motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            />

            <Motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-10 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">File a Complaint</h2>
                    <p className="text-slate-400 text-sm">Submit your issue to the protocol.</p>
                  </div>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <form className="p-10 space-y-4" onSubmit={handleSubmit}>
                {/* Row 1: Category and Title Side by Side */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category_id}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer transition-all"
                        required
                      >
                        {dbCategories.map(cat => (
                          <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div className="flex-[1.5] space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subject Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Server downtime in building A"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Description with Word Counter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end ml-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detailed Description</label>
                    <span className={`text-[10px] font-mono ${formData.description.length >= 2000 ? 'text-rose-500' : 'text-slate-500'}`}>
                      {formData.description.length} / 2000 characters
                    </span>
                  </div>
                  <textarea 
                    rows="5"
                    maxLength="2000"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-indigo-500 resize-none transition-all"
                    required
                  ></textarea>
                </div>

                {/* Row 3: Attachment with Filename Preview */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Supporting Documents (Optional)</label>
                  <div className="relative flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-15 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-950/30 hover:bg-slate-800/40 hover:border-indigo-500/50 transition-all">
                      <div className="flex flex-center gap-3">
                        <Paperclip className={`w-5 h-5 ${selectedFiles ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <p className="text-sm text-slate-400">
                          {selectedFiles ? (
                            <span className="text-indigo-400 font-medium">{selectedFiles.length} images selected</span>
                          ) : (
                            <span>Click to upload or drag and drop | Max 5MB</span>
                          )}
                        </p>
                      </div>
                      <input 
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setSelectedFiles(files); 
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Row 4: Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Send size={18} /> Submit Complaint
                  </button>
                </div>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}