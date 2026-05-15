import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Check, PartyPopper, AlertCircle, X } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import useAuth from "../core/hooks/useAuth";
import { getStrength } from "../utils/getPassStrength";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register, loading, error, message, showToast } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const requirements = [
    { met: formData.password.length >= 8, label: "8+ Char" },
    { met: /[A-Z]/.test(formData.password), label: "Uppercase" },
    { met: /[0-9]/.test(formData.password), label: "Number" },
    { met: /[^A-Za-z0-9]/.test(formData.password), label: "Symbol" }
  ];

  const strength = getStrength(requirements);
  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength.label === "Weak" || !passwordsMatch) return;
    
    // Join names for backend: "First M. Last"
    const fullName = `${formData.firstName} ${formData.middleInitial ? formData.middleInitial + '. ' : ''}${formData.lastName}`.trim();
    
    await register(fullName, formData.email, formData.password);
  };

  const inputClasses = (fieldName) => `
    w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 text-white 
    border transition-all duration-200 outline-none text-sm
    ${focusedField === fieldName 
      ? 'border-blue-500/50 ring-2 ring-blue-500/20 bg-slate-800' 
      : 'border-slate-700 hover:border-slate-600'}
    placeholder:text-slate-500
  `;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden py-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 z-50 flex items-center gap-3 bg-slate-900 border border-emerald-500/30 px-5 py-3 rounded-xl shadow-2xl"
          >
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
              <PartyPopper size={18} />
            </div>
            <div>
              <p className="text-white font-bold text-xs">Success!</p>
              <p className="text-slate-400 text-[10px]">{message || "Account created."}</p>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-slate-950 to-slate-950" />
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

      <Motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-6 md:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 mb-3">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">ResolveFlow</h1>
            <p className="text-slate-400 text-xs mt-1">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center flex items-center justify-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Grid - Better Alignment */}
            <div className="flex flex-wrap md:flex-nowrap gap-3">
              <div className="flex-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase ml-1">First Name</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'firstName' ? 'text-blue-400' : 'text-slate-500'}`} size={16} />
                  <input
                    type="text" required placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={inputClasses('firstName')}
                    onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
              <div className="w-16 md:w-20 space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase text-center ml-1">M.I.</label>
                <input
                  type="text" maxLength={1} placeholder="D"
                  value={formData.middleInitial}
                  onChange={(e) => setFormData({...formData, middleInitial: e.target.value.toUpperCase()})}
                  className="w-full py-2.5 rounded-xl bg-slate-800/50 text-white border border-slate-700 outline-none text-sm text-center focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="flex-2 space-y-1 w-full md:w-auto">
                <label className="text-[11px] font-semibold text-slate-300 uppercase ml-1">Last Name</label>
                <input
                  type="text" required placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={inputClasses('lastName').replace('pl-10', 'pl-4')}
                  onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-blue-400' : 'text-slate-500'}`} size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={inputClasses('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-blue-400' : 'text-slate-500'}`} size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`${inputClasses('password')} pr-10`}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300 uppercase ml-1">Confirm</label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {passwordsMatch ? <Check size={16} /> : <Lock size={16} />}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className={`${inputClasses('confirmPassword')} ${formData.confirmPassword && !passwordsMatch ? 'border-rose-500/50 ring-rose-500/10' : ''}`}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>

            {/* Strength & Criteria - Integrated Section */}
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {requirements.map((req, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors ${
                      req.met ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {req.met ? <Check size={8} className="inline mr-1" /> : <X size={8} className="inline mr-1" />}
                      {req.label}
                    </span>
                  ))}
                </div>
                <span className={`text-[10px] font-bold ${strength.color === 'emerald' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {strength.label}
                </span>
              </div>
              
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <Motion.div animate={{ width: strength.width }} className={`h-full ${
                  strength.color === 'red' ? 'bg-red-500' : strength.color === 'orange' ? 'bg-orange-500' : strength.color === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'
                }`} />
              </div>
              
              {!passwordsMatch && formData.confirmPassword && (
                <p className="text-rose-400 text-[9px] flex items-center gap-1 font-bold italic uppercase tracking-wider">
                  <AlertCircle size={10} /> Passwords must match
                </p>
              )}
            </div>

            <button
              disabled={loading || strength.label === "Weak" || !passwordsMatch || showToast}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700/50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg text-sm mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : showToast ? (
                <>
                  <Check size={16} />
                  <span>Ready!</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-3 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
          <span className="flex items-center gap-1"><Shield size={10} /> 256-bit AES</span>
          <span className="w-1 h-1 rounded-full bg-slate-800" />
          <span>SSL Secure Connection</span>
        </div>
      </Motion.div>
    </div>
  );
}