import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import useAuth from "../core/hooks/useAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login, loading, error } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    await login(email, password);
  };

  const inputClasses = (fieldName) => `
    w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 text-white 
    border transition-all duration-200 outline-none
    ${focusedField === fieldName 
      ? 'border-blue-500/50 ring-2 ring-blue-500/20 bg-slate-800' 
      : 'border-slate-700 hover:border-slate-600'}
    placeholder:text-slate-500
  `;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-slate-950 to-slate-950" />
      
      {/* Decorative blur */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4"
            >
              <Shield className="w-7 h-7 text-blue-400" />
            </Motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ResolveFlow</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to your account</p>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <Mail 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-blue-400' : 'text-slate-500'
                  }`} 
                  size={20} 
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className={inputClasses('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-blue-400' : 'text-slate-500'
                  }`} 
                  size={20} 
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className={`${inputClasses('password')} pr-12`}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-1">

              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700/50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Create account
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