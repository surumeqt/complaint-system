import useAuth from "../core/hooks/useAuth";

export const LogoutModal = ({ isOpen, onClose }) => {
  const { logout, loading } = useAuth();

  if (!isOpen) return null;
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-indigo-500/30 rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">End Session?</h3>
        <p className="text-slate-400 mb-6">Are you sure you want to log out? You will need to re-authenticate to access your dashboard.</p>
        
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            Cancel
          </button>
          <button 
            onClick={handleLogout} 
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition"
            >
            {loading ? 'Logging out...' : 'Logout' }
          </button>
        </div>
      </div>
    </div>
  );
};