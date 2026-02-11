import React, { useState } from "react";
import { AlertCircle, ArrowLeft, Mail, ShieldCheck, Lock, ArrowRight } from "lucide-react";
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
        setSuccess("OTP sent to your email");
      }
    } catch (err) {
      setError("Server error");
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
        setSuccess("Password reset successful. You can login now.");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Branding - Consistent with Login UI */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-[#FCD535] uppercase italic tracking-tighter mb-2">
            DubaiP2P
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest">
            {step === 1 ? "Password Recovery" : "Set New Password"}
          </p>
        </div>

        {/* Form Card - Consistent 3xl Rounded Style */}
        <div className="bg-[#161A1E] border border-zinc-800 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-black/50">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-1">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-tight">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-1">
              <ShieldCheck size={18} className="text-green-500 shrink-0" />
              <p className="text-xs font-bold text-green-400 uppercase tracking-tight">{success}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                  Email address
                </label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#FCD535] text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/10"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Recovery Code <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                  Enter 6-Digit OTP
                </label>
                <div className="relative group">
                  <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-lg md:text-2xl text-white outline-none focus:border-yellow-500/50 transition-all font-black tracking-[0.5em] text-center"
                    placeholder="000000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black ml-1">
                  New Secure Password
                </label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-green-900/10"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm New Password <CheckCircle2 size={16} className="ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Secure Login
            </Link>
          </div>
        </div>

        <p className="text-center text-[9px] text-zinc-600 mt-8 uppercase font-bold tracking-[0.2em]">
          Identity Verification System • Active
        </p>
      </div>
    </div>
  );
}