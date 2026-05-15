import { useState } from 'react';
import { 
  User, Mail, Phone, ShieldCheck, 
  Save, Key, Camera, Check, AlertCircle 
} from 'lucide-react';
import useAuth from '../../core/hooks/useAuth';
import useUserService from '../../core/hooks/useUserService';

export default function UserProfile() {
  const { user } = useAuth();
  const { updateProfile, loading, error, success } = useUserService();
  const [formData, setFormData] = useState({
    fullName: user?.name || "N/A",
    phone: user?.phone_number || "N/A",
    email: user?.email || "N/A",
  });

  const handleSave = async () => {
    await updateProfile(formData.fullName, formData.phone).then(() => {
      window.location.reload();
    });
  };

  // Dynamic Button Styling
  const getButtonStyles = () => {
    if (loading) return "bg-slate-800 cursor-wait";
    if (success) return "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20";
    if (error) return "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20";
    return "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-slate-400 mt-1 text-sm">Update your personal information and security preferences.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Success/Error Feedback Message */}
          <div className="hidden md:block text-right">
            {success && <p className="text-emerald-400 text-sm font-bold flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
              <Check size={16}/> Profile updated!
            </p>}
            {error && <p className="text-rose-400 text-sm font-bold flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
              <AlertCircle size={16}/> {error}
            </p>}
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center justify-center gap-2 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${getButtonStyles()}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <>
                <Check size={18} />
                Saved
              </>
            ) : error ? (
              <>
                <AlertCircle size={18} />
                Try Again
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-br from-indigo-600/20 to-transparent" />
            
            <div className="relative mb-6 inline-block">
              <div className="w-24 h-24 rounded-[2.5rem] bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-500/40">
                {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-slate-800 border border-slate-700 text-white rounded-xl hover:bg-slate-700 transition-colors shadow-lg">
                <Camera size={16} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{formData.fullName}</h3>
            <p className="text-slate-500 text-xs font-mono mt-1 uppercase tracking-widest">{user?.id || "RF-USR-001"}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-2 text-emerald-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified Account</span>
            </div>
          </div>
        </div>

        {/* Input Forms Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <User size={16} className="text-indigo-400" />
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-slate-800/40 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 transition-all focus:bg-slate-800/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-800/40 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 transition-all focus:bg-slate-800/60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Locked Section */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8">
            <h4 className="text-slate-400 font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Mail size={16} />
              Account Credentials
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest ml-1">Registered Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                  <input 
                    disabled 
                    value={formData.email}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-600 cursor-not-allowed italic"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700 uppercase tracking-tighter">
                    Locked
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Security Password</p>
                    <p className="text-xs text-slate-500 italic">Last security update: 3 months ago</p>
                  </div>
                </div>
                <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold bg-indigo-500/5 hover:bg-indigo-500/10 px-5 py-2.5 rounded-xl transition-all border border-indigo-500/10 uppercase tracking-widest">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}