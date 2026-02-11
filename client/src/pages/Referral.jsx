import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Gift, Copy, Check, Share2, Users } from 'lucide-react'
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
    toast.success(`${id === 'code' ? 'Code' : 'Link'} copied to clipboard!`)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-20">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-yellow-500/10 rounded-xl text-[#FCD535]">
          <Gift size={24} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Refer & Earn</h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Grow the network and earn rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Card */}
        <div className="bg-[#161A1E] p-6 md:p-8 rounded-[2rem] border border-zinc-800 shadow-2xl space-y-6 transition-all hover:border-zinc-700">
          
          <div className="space-y-4">
            {/* Code Box */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold ml-1">
                Your Unique Code
              </label>
              <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl group focus-within:border-yellow-500/30 transition-all">
                <span className="font-mono text-lg text-white font-black tracking-wider">{code}</span>
                <button 
                  onClick={() => copyToClipboard(code, 'code')}
                  className="p-2 text-zinc-500 hover:text-[#FCD535] transition-colors"
                >
                  {copied === 'code' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Link Box */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold ml-1">
                Invitation Link
              </label>
              <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl group focus-within:border-yellow-500/30 transition-all">
                <span className="font-mono text-xs text-zinc-400 truncate mr-4">{link}</span>
                <button 
                  onClick={() => copyToClipboard(link, 'link')}
                  className="p-2 text-zinc-500 hover:text-[#FCD535] transition-colors shrink-0"
                >
                  {copied === 'link' ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter text-center leading-relaxed px-4">
            Earn commission on every successful exchange made by your referred friends.
          </p>
        </div>

        
      </div>
    </div>
  )
}