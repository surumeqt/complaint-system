import { motion as Motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, PartyPopper } from "lucide-react";
import { useEffect } from "react";

export default function ToastModal({ message, type = "success", isVisible, onClose }) {
  
  // Auto-hide the toast after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed top-6 left-0 right-0 z-100 flex justify-center px-4 pointer-events-none"
        >
          <div className={`
            pointer-events-auto flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-2xl shadow-2xl border backdrop-blur-xl
            ${type === "success" 
              ? "bg-slate-900/90 border-emerald-500/30 shadow-emerald-500/10" 
              : "bg-slate-900/90 border-rose-500/30 shadow-rose-500/10"}
          `}>
            {/* Icon Section */}
            <div className={`
              shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}
            `}>
              {type === "success" ? <PartyPopper size={20} /> : <AlertCircle size={20} />}
            </div>

            {/* Text Section */}
            <div className="flex-1">
              <p className="text-white font-bold text-sm">
                {type === "success" ? "Success!" : "Something went wrong"}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="shrink-0 text-slate-500 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}