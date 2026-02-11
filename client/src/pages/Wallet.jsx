import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Wallet as WalletIcon, ArrowUpRight } from 'lucide-react'

export default function Wallet(){
  const { user } = useContext(AuthContext)

  return (
    <div className="p-5 md:p-6 bg-[#161A1E] rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group transition-all hover:border-zinc-700">
      
      {/* Dynamic Background Decoration for Premium feel */}
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <WalletIcon size={120} className="text-[#FCD535]" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/10 rounded-xl text-[#FCD535]">
          <WalletIcon size={20} />
        </div>
        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500">
          Available Balance
        </h4>
      </div>

      <div className="flex items-baseline gap-1 relative z-10">
        {/* Changed to Rupee symbol to match your Home.jsx INR focus */}
        <span className="text-lg md:text-xl font-bold text-gray-400">₹</span>
        <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">
          {user?.balance?.toLocaleString() || '0'}.00
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => window.location.href='/exchange'}
          className="flex-1 bg-[#FCD535] text-black py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all active:scale-95"
        >
          Add Funds <ArrowUpRight size={14} />
        </button>
      </div>

      <p className="text-[9px] text-gray-600 mt-4 uppercase font-bold tracking-tighter text-center sm:text-left">
        Syncing with secure P2P node...
      </p>
    </div>
  )
}