import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Eye, Clock, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react'

export default function MyExchanges(){
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(()=>{ fetchTrades() }, [])

  const fetchTrades = async ()=>{
    setLoading(true)
    try{
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/my', { headers: { Authorization: `Bearer ${token}` }})
      const d = await res.json()
      setTrades(d.trades || [])
    }catch(e){console.error(e)}
    setLoading(false)
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock className="text-yellow-500" size={16} />
      case 'PAID': return <Clock className="text-blue-500" size={16} />
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={16} />
      case 'CANCELLED': return <AlertCircle className="text-red-500" size={16} />
      default: return <Clock className="text-gray-500" size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-900/20 border-yellow-500/30'
      case 'PAID': return 'text-blue-500 bg-blue-900/20 border-blue-500/30'
      case 'COMPLETED': return 'text-green-500 bg-green-900/20 border-green-500/30'
      case 'CANCELLED': return 'text-red-500 bg-red-900/20 border-red-500/30'
      default: return 'text-gray-500 bg-gray-900/20 border-gray-500/30'
    }
  }

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true
    return trade.status.toLowerCase() === filter
  })

  const statusCounts = {
    all: trades.length,
    pending: trades.filter(t => t.status === 'PENDING').length,
    paid: trades.filter(t => t.status === 'PAID').length,
    completed: trades.filter(t => t.status === 'COMPLETED').length,
    cancelled: trades.filter(t => t.status === 'CANCELLED').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FCD535] mb-2">My Exchanges</h1>
            <p className="text-gray-400">Track all your P2P exchange transactions</p>
          </div>
          <button
            onClick={fetchTrades}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'paid', label: 'Paid', count: statusCounts.paid },
            { key: 'completed', label: 'Completed', count: statusCounts.completed },
            { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                filter === key
                  ? 'bg-[#FCD535] text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Trades List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCD535] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your exchanges...</p>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No exchanges found</h3>
              <p className="text-gray-400">
                {filter === 'all' ? 'You haven\'t made any exchanges yet.' : `No ${filter} exchanges found.`}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#FCD535] text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            >
              Start Your First Exchange
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrades.map(trade => (
              <div
                key={trade._id}
                className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition cursor-pointer"
                onClick={() => navigate(`/trade/${trade._id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono text-gray-400">
                      #{trade._id.slice(-8)}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm ${getStatusColor(trade.status)}`}>
                      {getStatusIcon(trade.status)}
                      {trade.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <Eye size={16} />
                    <span className="text-sm">View Details</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">You Send</p>
                    <p className="text-lg font-bold text-red-400">₹{trade.fiatAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{trade.sendMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">You Receive</p>
                    <p className="text-lg font-bold text-green-400">{trade.cryptoAmount} USDT</p>
                    <p className="text-sm text-gray-500">{trade.receiveMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Exchange Rate</p>
                    <p className="text-sm font-semibold">1 USDT = ₹{trade.rate.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {trade.status === 'COMPLETED' && trade.txid && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                    <p className="text-xs font-mono text-green-300 break-all">{trade.txid}</p>
                  </div>
                )}

                {trade.status === 'CANCELLED' && trade.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-xs text-red-400 mb-1">Cancellation Reason:</p>
                    <p className="text-sm text-red-300">{trade.rejectionReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {trades.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#FCD535]">{statusCounts.completed}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{statusCounts.paid}</p>
              <p className="text-sm text-gray-400">Awaiting</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{statusCounts.cancelled}</p>
              <p className="text-sm text-gray-400">Cancelled</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
