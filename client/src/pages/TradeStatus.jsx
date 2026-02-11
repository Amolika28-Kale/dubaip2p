import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CheckCircle, Clock, Upload, AlertCircle, Copy, ArrowRightLeft } from 'lucide-react'
import { getTradeById } from '../services/exchangeService'
import toast from 'react-hot-toast'

export default function TradeStatus() {
  const { tradeId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const [trade, setTrade] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [phase, setPhase] = useState('30min')

  useEffect(() => { fetchTrade() }, [tradeId])

  useEffect(() => {
    if (trade && trade.status === 'PAID' && trade.paidAt) {
      const paidTime = new Date(trade.paidAt).getTime()
      const thirtyMin = 30 * 60 * 1000
      const seventyTwoHours = 72 * 60 * 60 * 1000

      const interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - paidTime

        if (elapsed < thirtyMin) {
          setPhase('30min')
          setTimeLeft(thirtyMin - elapsed)
        } else {
          setPhase('72hr')
          setTimeLeft(seventyTwoHours - elapsed)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [trade])

  const fetchTrade = async () => {
    try {
      const d = await getTradeById(tradeId)
      if (d.trade) setTrade(d.trade)
    } catch (e) { console.error(e) }
  }

  const upload = async () => {
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('screenshot', file)
    fd.append('tradeId', tradeId)
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/confirm-payment', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      const d = await res.json()
      if (d.trade) {
        setTrade(d.trade)
        toast.success('Proof uploaded successfully')
      }
    } catch (e) { toast.error('Upload failed') }
    setLoading(false)
  }

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (!trade) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCD535]"></div>
    </div>
  )

  const isSell = trade.type === 'SELL'

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ArrowRightLeft className="text-[#FCD535]" /> Order Details
            </h1>
            <p className="text-gray-500 text-sm">ID: {trade._id}</p>
          </div>
          <div className={`px-4 py-1 rounded-full text-xs font-bold border ${
            trade.status === 'COMPLETED' ? 'border-green-500 text-green-500 bg-green-500/10' :
            trade.status === 'CANCELLED' ? 'border-red-500 text-red-500 bg-red-500/10' :
            'border-yellow-500 text-yellow-500 bg-yellow-500/10'
          }`}>
            {trade.status}
          </div>
        </div>

        {/* Amount Summary Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">You Send</p>
              <p className="text-xl font-black">
                {isSell ? `${trade.cryptoAmount} USDT` : `₹${trade.fiatAmount.toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{trade.sendMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">You Receive</p>
              <p className="text-xl font-black text-[#FCD535]">
                {isSell ? `₹${trade.fiatAmount.toLocaleString()}` : `${trade.cryptoAmount} USDT`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{trade.receiveMethod}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs text-gray-500 mb-2 uppercase font-bold">Payout Details</p>
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-zinc-800">
              <code className="text-xs text-gray-300 truncate mr-4">{trade.walletAddress}</code>
              <button onClick={() => copyToClipboard(trade.walletAddress)} className="text-[#FCD535] p-1"><Copy size={16} /></button>
            </div>
          </div>
        </div>

        {/* Dynamic Status View */}
        {trade.status === 'PENDING' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload size={20} className="text-yellow-500" /> Upload Payment Proof
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Please upload the transaction screenshot. {isSell ? 'Transfer USDT to the admin address shown on the previous screen.' : 'Transfer INR to the admin UPI/Bank.'}
              </p>

              <label className={`block border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragActive ? 'border-[#FCD535] bg-yellow-500/5' : 'border-zinc-800 hover:border-zinc-700'
              }`}
                onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragActive(false)}}
              >
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="text-green-500 mb-2" />
                    <span className="text-sm font-bold">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-gray-600 mb-2" />
                    <span className="text-sm text-gray-500">Click to browse or drag & drop</span>
                  </>
                )}
              </label>

              {file && (
                <button 
                  onClick={upload} 
                  disabled={loading}
                  className="w-full mt-4 bg-[#FCD535] text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Submit Proof'}
                </button>
              )}
            </div>
          </div>
        )}

        {trade.status === 'PAID' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Verifying Payment</h3>
            <p className="text-gray-500 text-sm mb-8">
              Admin is checking your {isSell ? 'USDT transfer' : 'INR payment'}. 
              {isSell ? ' INR will be credited to your account shortly.' : ' USDT will be released to your wallet shortly.'}
            </p>

            <div className="text-4xl font-black text-[#FCD535] mb-2 tracking-tighter">
              {formatTime(timeLeft)}
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Estimated Wait Time</p>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${phase === '30min' ? 'bg-blue-500' : 'bg-red-500'}`}
                style={{ width: phase === '30min' ? `${Math.min(100, ((1800000 - timeLeft) / 1800000) * 100)}%` : '100%' }}
              />
            </div>
            
            <button onClick={fetchTrade} className="mt-8 text-xs text-[#FCD535] font-bold hover:underline">
              Refresh Status
            </button>
          </div>
        )}

        {trade.status === 'COMPLETED' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Exchange Successful</h3>
            <p className="text-gray-500 text-sm mb-6">
              The {isSell ? 'INR payout' : 'USDT release'} has been processed.
            </p>
            
            {trade.txid && (
              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800 mb-6 text-left">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Transaction ID / Hash</p>
                <code className="text-[10px] text-green-400 break-all">{trade.txid}</code>
              </div>
            )}

            <button onClick={() => navigate('/exchange')} className="w-full bg-zinc-800 hover:bg-zinc-700 py-4 rounded-xl font-bold transition">
              New Exchange
            </button>
          </div>
        )}

        {trade.status === 'CANCELLED' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Exchange Cancelled</h3>
            <p className="text-gray-500 text-sm mb-4">This trade was not successful.</p>
            {trade.rejectionReason && (
              <p className="text-red-400 text-sm font-medium italic mb-6">"{trade.rejectionReason}"</p>
            )}
            <button onClick={() => navigate('/exchange')} className="w-full bg-zinc-800 hover:bg-zinc-700 py-4 rounded-xl font-bold transition">
              Try Again
            </button>
          </div>
        )}
      </div>
      
    </div>
  )
}