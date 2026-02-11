import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightLeft, Activity } from 'lucide-react'
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
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-[2rem] border border-zinc-800 bg-[#161A1E]/60 backdrop-blur-md p-4 md:p-6 shadow-2xl">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500/10 rounded-lg text-[#FCD535]">
            <Activity size={14} />
          </div>
          <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-gray-400 uppercase">
            Live Market Feed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[9px] md:text-[10px] font-black text-green-400 uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>

      {/* LIST CONTAINER */}
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto no-scrollbar relative">
        <AnimatePresence initial={false}>
          {trades.map((t) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`
                flex items-center justify-between
                rounded-2xl px-4 py-3 text-[11px] md:text-xs
                border transition-colors duration-500
                ${t._isNew
                  ? 'border-[#FCD535]/40 bg-[#FCD535]/5 shadow-[0_0_15px_rgba(252,213,53,0.05)]'
                  : 'border-zinc-800/50 bg-zinc-900/40'}
              `}
            >
              {/* TRADE ID - Compact on Mobile */}
              <div className="font-mono font-bold text-zinc-500 shrink-0">
                #{t._id.slice(-4).toUpperCase()}
              </div>

              {/* FLOW - Flexible Gap */}
              <div className="flex items-center gap-2 md:gap-4 px-2 overflow-hidden">
                <span className="font-black text-white truncate max-w-[60px] md:max-w-none">
                  {t.sendMethod.split('-')[0]}
                </span>
                <ArrowRightLeft size={10} className="text-[#FCD535] shrink-0 opacity-80" />
                <span className="font-black text-white truncate max-w-[60px] md:max-w-none">
                   {t.receiveMethod.split('-')[0]}
                </span>
              </div>

              {/* AMOUNT - High Contrast */}
              <div className="text-right shrink-0">
                <div className="font-black text-[#FCD535] text-sm md:text-base tracking-tighter">
                  ₹{Number(t.fiatAmount).toLocaleString()}
                </div>
                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">
                  Confirmed
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 opacity-20">
            <Activity className="animate-spin mb-2" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest">Connecting to Chain...</p>
          </div>
        )}

        {!loading && trades.length === 0 && (
          <div className="text-center text-zinc-600 font-bold text-[10px] py-10 uppercase tracking-widest">
            No recent activity detected
          </div>
        )}
      </div>

      {/* GRADIENT FADE */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#161A1E] to-transparent rounded-b-[2rem]" />
    </div>
  )
}