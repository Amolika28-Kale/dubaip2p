import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Wallet as WalletIcon, ArrowUpRight, Activity } from 'lucide-react'

export default function Wallet(){
  const { user } = useContext(AuthContext)

  return (
    <div className="p-6 md:p-8 bg-[#181a20] rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden group transition-all hover:border-blue-500/30">
      
      {/* Institutional Background Decoration */}
      <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none rotate-12">
        <WalletIcon size={160} className="text-blue-500" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-600/20 shadow-inner">
            <WalletIcon size={20} />
          </div>
          <div>
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              Equity Balance
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Vault Sync Active</p>
            </div>
          </div>
        </div>
        <Activity size={16} className="text-blue-900/50" />
      </div>

      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-xl md:text-2xl font-black text-blue-600 italic">₹</span>
        <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          {user?.balance?.toLocaleString() || '0'}<span className="text-xl text-gray-600 font-bold">.00</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 relative z-10">
        <button 
          onClick={() => window.location.href='/exchange'}
          className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.97]"
        >
          Deposit Funds <ArrowUpRight size={14} className="stroke-[3px]" />
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800/50 flex justify-between items-center">
         <p className="text-[9px] text-gray-600 uppercase font-black tracking-tighter">
           Secured via Cold-Escrow
         </p>
         <p className="text-[9px] text-blue-900 font-black uppercase tracking-widest opacity-40">
           ID: {user?.id?.slice(-6).toUpperCase() || 'P2P-NODE'}
         </p>
      </div>
    </div>
  )
}