import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightLeft, Activity, ShieldCheck } from 'lucide-react'
import { getLatestExchanges } from '../services/exchangeService'

export default function LatestExchangesTicker() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const lastIds = useRef(new Set())

  useEffect(() => {
    let mounted = true

    const fetchTrades = async () => {
      try {
        const d = await getLatestExchanges(10)
        if (!mounted) return

        const incoming = d.trades || []

        incoming.forEach(t => {
          if (!lastIds.current.has(t._id)) {
            t._isNew = true
            lastIds.current.add(t._id)
          }
        })

        setTrades(incoming.slice(0, 10))
        setLoading(false)
      } catch (e) {
        console.error("Ticker fetch error:", e)
      }
    }

    fetchTrades()
    const iv = setInterval(fetchTrades, 10000)

    return () => {
      mounted = false
      clearInterval(iv)
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-[2rem] border border-gray-800 bg-[#181a20]/60 backdrop-blur-xl p-4 md:p-6 shadow-2xl relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-600/20 shadow-inner">
            <Activity size={14} />
          </div>
          <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-gray-400 uppercase">
            Live Settlement Feed
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[#0b0e11] px-3 py-1 rounded-full border border-gray-800">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">
            Syncing
          </span>
        </div>
      </div>

      {/* LIST CONTAINER */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar relative">
        <AnimatePresence initial={false}>
          {trades.map((t) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className={`
                flex items-center justify-between
                rounded-2xl px-5 py-3.5 text-[11px] md:text-xs
                border transition-all duration-700
                ${t._isNew
                  ? 'border-blue-500/40 bg-blue-600/5 shadow-[0_0_20px_rgba(37,99,235,0.05)]'
                  : 'border-gray-800 bg-[#0b0e11]/40'}
              `}
            >
              {/* TRADE ID - Terminal Style */}
              <div className="font-mono font-black text-zinc-600 shrink-0 tracking-tighter">
                NODE-{t._id.slice(-4).toUpperCase()}
              </div>

              {/* FLOW - High Contrast White */}
              <div className="flex items-center gap-3 md:gap-5 px-2 overflow-hidden italic">
                <span className="font-black text-white truncate max-w-[70px] md:max-w-none tracking-tighter">
                  {t.sendMethod.split('-')[0]}
                </span>
                <div className="p-1 bg-blue-600/10 rounded-md">
                   <ArrowRightLeft size={10} className="text-blue-500 shrink-0 opacity-80" />
                </div>
                <span className="font-black text-white truncate max-w-[70px] md:max-w-none tracking-tighter">
                   {t.receiveMethod.split('-')[0]}
                </span>
              </div>

              {/* AMOUNT - Blue/Red Accents */}
              <div className="text-right shrink-0">
                <div className="font-black text-blue-500 text-sm md:text-base tracking-tighter">
                  ₹{Number(t.fiatAmount).toLocaleString()}
                </div>
                <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest flex items-center justify-end gap-1">
                  <ShieldCheck size={8} className="text-green-500" /> Secure
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 opacity-30">
            <Activity className="animate-spin mb-3 text-blue-500" size={28} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Accessing Ledger Nodes...</p>
          </div>
        )}

        {!loading && trades.length === 0 && (
          <div className="text-center text-zinc-700 font-black text-[10px] py-16 uppercase tracking-[0.2em] italic">
            Zero network latency • Ready for trade
          </div>
        )}
      </div>

      {/* FOOTER FADE */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#181a20] to-transparent rounded-b-[2rem]" />
    </div>
  )
}