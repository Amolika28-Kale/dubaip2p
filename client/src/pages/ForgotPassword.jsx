import React, { useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FCD535] mb-2">DubaiP2P</h1>
          <p className="text-gray-400">
            {step === 1 ? "Forgot your password?" : "Reset your password"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex gap-2">
              <AlertCircle size={18} className="text-red-400 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-sm text-green-300">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FCD535] text-black py-3 rounded-lg font-semibold hover:bg-[#FCD535]/90 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#FCD535] text-black py-3 rounded-lg font-semibold hover:bg-[#FCD535]/90 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white mt-6"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
