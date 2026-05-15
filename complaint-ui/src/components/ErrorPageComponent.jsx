import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  Lock, 
  RefreshCcw, 
  Home, 
  ChevronLeft 
} from 'lucide-react';
import useAuth from '../core/hooks/useAuth';

const ErrorPageComponent = ({ status = 404 }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const errorConfigs = {
    401: {
      title: "Session Expired",
      message: "For your security, your session has timed out. Please sign in again to access your accounts.",
      icon: Lock,
      color: "blue",
      actionText: "Return to Login",
      action: () => navigate('/login').then(() => window.location.reload())
    },
    403: {
      title: "Access Denied",
      message: "You don't have permission to view this high-security area. Please contact an administrator if you believe this is an error.",
      icon: ShieldAlert,
      color: "red",
      actionText: "Back to Dashboard",
      action: () => navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
    },
    404: {
      title: "Page Not Found",
      message: "The vault or page you're looking for doesn't exist or has been moved to a new secure location.",
      icon: Search,
      color: "slate",
      actionText: "Go Home",
      action: () => navigate('/').then(() => window.location.reload())
    },
    500: {
      title: "System Maintenance",
      message: "Our servers are experiencing a brief hiccup. Your funds remain secure. Please try again in a few moments.",
      icon: RefreshCcw,
      color: "amber",
      actionText: "Reload Page",
      action: () => window.location.reload()
    }
  };

  const config = errorConfigs[status] || errorConfigs[404];
  const Icon = config.icon;

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100"
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* Animated Icon Container */}
        <Motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`w-24 h-24 mx-auto rounded-[2.5rem] flex items-center justify-center mb-8 border-2 ${colorClasses[config.color]}`}
        >
          <Icon size={40} strokeWidth={2.5} />
        </Motion.div>

        {/* Text Content */}
        <Motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
            Error {status}
          </h1>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            {config.title}
          </h2>
          <p className="text-slate-500 text-base leading-relaxed mb-10 px-4">
            {config.message}
          </p>
        </Motion.div>

        {/* Action Buttons */}
        <Motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <button 
            onClick={config.action}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            {config.actionText}
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-2"
          >
            <ChevronLeft size={18} />
            Go Back
          </button>
        </Motion.div>

        {/* Security Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-300">
          <Home size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">ResolveFlow Security Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPageComponent;