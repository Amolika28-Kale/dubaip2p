import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { User, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext)
  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const save = async () => {
    setLoading(true)
    setMsg('')
    const success = await updateProfile(username, password)
    if (success) {
      setMsg('Profile updated successfully')
      setPassword('')
    } else {
      setMsg('Failed to update profile')
    }
    setLoading(false)
  }

  return (
    <div className="p-5 md:p-6 bg-[#161A1E] rounded-[2rem] border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-xl text-[#FCD535]">
          <User size={20} />
        </div>
        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500">
          Account Settings
        </h4>
      </div>

      <div className="space-y-4">
        {/* Username Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold ml-1">
            Display Username
          </label>
          <div className="relative group">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold ml-1">
            Security Password
          </label>
          <div className="relative group">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter new password..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all font-medium"
            />
          </div>
          <p className="text-[9px] text-zinc-600 mt-2 italic px-1 uppercase font-bold tracking-tighter">
            Leave blank to keep existing password
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={save} 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#FCD535] text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/5 mt-2"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Update Profile <Save size={14} />
            </>
          )}
        </button>

        {/* Feedback Message */}
        {msg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-[11px] font-bold uppercase tracking-tight animate-in fade-in slide-in-from-top-1 duration-300 ${
            msg.includes('successfully') 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {msg.includes('successfully') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}