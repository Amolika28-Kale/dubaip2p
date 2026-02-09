import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightLeft } from 'lucide-react'
import { getLatestExchanges } from '../services/exchangeService'

export default function LatestExchangesTicker() {
  const [trades, setTrades] = useState([])
  const lastIds = useRef(new Set())

  useEffect(() => {
    let mounted = true

    const fetchTrades = async () => {
      try {
        const d = await getLatestExchanges(10)

        if (!mounted) return

        const incoming = d.trades || []

        // mark new trades
        incoming.forEach(t => {
          if (!lastIds.current.has(t._id)) {
            t._isNew = true
            lastIds.current.add(t._id)
          }
        })

        setTrades(incoming.slice(0, 10))
      } catch (e) {}
    }

    fetchTrades()
    const iv = setInterval(fetchTrades, 10000)

    return () => {
      mounted = false
      clearInterval(iv)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-black p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold tracking-widest text-gray-400">
          LIVE EXCHANGES
        </div>
        <span className="text-[10px] text-green-400 animate-pulse">
          ● LIVE
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {trades.map((t) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className={`
                flex items-center justify-between
                rounded-lg px-3 py-2 text-xs
                border
                ${t._isNew
                  ? 'border-[#FCD535]/60 bg-[#FCD535]/10'
                  : 'border-zinc-800 bg-zinc-900'}
              `}
            >
              {/* TRADE ID */}
              <div className="font-mono text-gray-400 w-14">
                #{t._id.slice(-6)}
              </div>

              {/* FLOW */}
              <div className="flex items-center gap-1 text-gray-300">
                {t.sendMethod}
                <ArrowRightLeft size={12} className="opacity-50" />
                {t.receiveMethod}
              </div>

              {/* AMOUNT */}
              <div className="font-bold text-[#FCD535]">
                ₹{Number(t.fiatAmount).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {trades.length === 0 && (
          <div className="text-center text-gray-500 text-xs py-4">
            Waiting for live trades…
          </div>
        )}
      </div>

      {/* FADE MASK */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}
