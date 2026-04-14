import React, { useState } from "react";
import { AlertCircle, ArrowLeft, Mail, ShieldCheck, Lock, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp+password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      if (!res.success) {
        setError(res.message || "Failed to send OTP");
      } else {
        setStep(2);
        setSuccess("Recovery code sent to your email");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword(email, otp, password);
      if (!res.success) {
        setError(res.message || "Reset failed");
      } else {
        setSuccess("Success! Your password has been updated.");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex items-center justify-center px-4 py-8 selection:bg-blue-100">
      
      {/* Background Subtle Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-100/30 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-200 text-xl">D</div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase italic text-gray-900">DubaiP2P</h1>
          </div>
          <h2 className="text-xl font-bold mb-1 text-gray-900">
            {step === 1 ? "Recover Access" : "Secure Your Account"}
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Identity Verification Protocol
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/50">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-1">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-600 uppercase tracking-tight">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-1">
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
              <p className="text-xs font-bold text-green-700 uppercase tracking-tight">{success}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                  Registered Email
                </label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1 text-center">
                  Verification Code
                </label>
                <div className="relative group">
                  <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl text-blue-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-black tracking-[0.4em] text-center"
                    placeholder="000000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                  New Security Password
                </label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Reset <CheckCircle2 size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
              <span className="px-4 bg-white text-gray-500 flex items-center gap-1 italic">
                <Zap size={10} fill="currentColor" className="text-blue-600"/> Recovery Node
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Secure Login
            </Link>
          </div>
        </div>

        <p className="text-center text-[9px] text-gray-400 mt-8 uppercase font-bold tracking-[0.2em]">
          Identity Management System • Active Shield
        </p>
      </div>
    </div>
  );
}