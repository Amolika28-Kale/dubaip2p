import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { User, Lock, Save, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'

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
    <div className="p-6 md:p-8 bg-white rounded-[2rem] border border-gray-200 shadow-lg transition-all hover:border-blue-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-200">
            <User size={20} />
          </div>
          <div>
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              Identity Node
            </h4>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
              UID: {user?.id?.slice(-8).toUpperCase() || 'P2P-AUTH'}
            </p>
          </div>
        </div>
        <ShieldCheck size={18} className="text-gray-300" />
      </div>

      <div className="space-y-6">
        {/* Username Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-black ml-1">
            Network Alias
          </label>
          <div className="relative group">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Enter alias..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-tight"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-black ml-1">
            Access Key
          </label>
          <div className="relative group">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Generate new access key..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-tight"
            />
          </div>
          <p className="text-[9px] text-gray-400 mt-3 italic px-1 uppercase font-black tracking-tighter">
            Leave null to maintain current credential
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={save} 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-50 shadow-md shadow-blue-200"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Authorize Updates <Save size={14} className="stroke-[3px]" />
            </>
          )}
        </button>

        {/* Feedback Message */}
        {msg && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-500 ${
            msg.includes('successfully') 
              ? 'bg-green-50 text-green-600 border border-green-200' 
              : 'bg-red-50 text-red-500 border border-red-200'
          }`}>
            {msg.includes('successfully') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}