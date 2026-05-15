import { User, Shield, Key } from 'lucide-react';
import useAuth from '../../core/hooks/useAuth';

export default function AdminSettings() {
    const { user } = useAuth();
  return (
    <div className="max-w-7xl space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">System Settings</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Admin Configuration Portal</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Account Section */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <User size={24} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Administrative Identity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Full Name</label>
              <input type="text" defaultValue={user?.name} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500 transition-all" readOnly/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Role</label>
              <input type="text" readOnly value={user?.role} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-slate-500 text-sm outline-none cursor-not-allowed" />
            </div>
          </div>
        </section>

        {/* Security / Protocol Section */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <Shield size={24} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Encryption Protocol</h3>
          </div>

          <div className="space-y-4">
             <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
                <div>
                   <p className="text-white text-xs font-bold">Backend Auto-Encryption</p>
                   <p className="text-[10px] text-slate-500 uppercase font-black">Status: Active & Validated</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
             </div>
             
             <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Key size={12} /> System Public Key Fingerprint
                </p>
                <code className="text-[10px] text-indigo-400 font-mono break-all opacity-70">
                   SHA256: 7f:9a:11:c2:44:b1:33:90:55:01:af:2e:99:1d:cc:44
                </code>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}