import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Gift, Copy, Check, Share2, Users, Activity, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Referral() {
  const { user } = useContext(AuthContext)
  const [copied, setCopied] = useState('')
  
  // Using the actual referral code from the user context
  const code = user?.referralCode || 'REF-XXXXXX'
  const link = `${window.location.origin}/signup?ref=${code}`

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    toast.success(`${id === 'code' ? 'ID' : 'Link'} encrypted & copied`)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-20 bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-200">
            <Gift size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Partner Rewards</h2>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Scale the network node</p>
          </div>
        </div>
        <Activity size={18} className="text-gray-300 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Card */}
        <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-200 shadow-lg space-y-8 transition-all hover:border-blue-300 hover:shadow-xl relative overflow-hidden group">
          
          {/* Decorative background */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
             <Share2 size={150} className="text-blue-600" />
          </div>

          <div className="space-y-6 relative z-10">
            {/* Code Box */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-black ml-1">
                Node Referral ID
              </label>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl group focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="font-mono text-lg text-blue-600 font-black tracking-widest uppercase">{code}</span>
                <button 
                  onClick={() => copyToClipboard(code, 'code')}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors active:scale-90"
                >
                  {copied === 'code' ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Link Box */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-black ml-1">
                Encoded Invitation Link
              </label>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl group focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="font-mono text-[10px] text-gray-500 truncate mr-4 italic uppercase">{link}</span>
                <button 
                  onClick={() => copyToClipboard(link, 'link')}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors shrink-0 active:scale-90"
                >
                  {copied === 'link' ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl relative z-10">
             <ShieldCheck size={16} className="text-blue-600" />
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight leading-relaxed">
               Earn instant commission on every successful settlement processed by your invited nodes.
             </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-200 shadow-lg flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="h-20 w-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mb-2 border border-blue-200 group-hover:scale-110 transition-transform">
                <Users size={36} />
            </div>
            <div>
              <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[11px] mb-2">Network Nodes</h3>
              <p className="text-5xl font-black text-gray-900 tracking-tighter italic">0</p>
            </div>
            
            <div className="pt-6 border-t border-gray-200 w-full">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">Commission Revenue</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm font-black text-blue-600 italic">₹</span>
                  <span className="text-2xl font-black text-green-600 tracking-tighter">0.00</span>
                </div>
            </div>
        </div>
      </div>
      
      <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] pt-4">
        DubaiP2P Governance Protocol v2.6
      </p>
    </div>
  )
}