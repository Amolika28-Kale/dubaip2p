import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CheckCircle, Clock, Upload, AlertCircle, Copy, ArrowRightLeft, Activity, ShieldCheck, ChevronRight } from 'lucide-react'
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
        toast.success('Escrow proof submitted')
      }
    } catch (e) { toast.error('Verification upload failed') }
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  )

  const isSell = trade.type === 'SELL'

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-4 md:pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="text-xl md:text-2xl font-black flex items-center gap-3 italic uppercase tracking-tighter text-gray-900">
              <Activity className="text-blue-600" /> Order Tracking
            </h1>
            <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase font-bold tracking-widest">Index: {trade._id.toUpperCase()}</p>
          </div>
          <div className={`w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm ${
            trade.status === 'COMPLETED' ? 'border-green-200 text-green-600 bg-green-50' :
            trade.status === 'CANCELLED' ? 'border-red-200 text-red-500 bg-red-50' :
            'border-blue-200 text-blue-600 bg-blue-50 animate-pulse'
          }`}>
            ● {trade.status === 'PAID' ? 'Under Review' : trade.status}
          </div>
        </div>

        {/* Amount Summary Card */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
             <ShieldCheck size={120} className="text-gray-900" />
          </div>
          
          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div className="border-l-2 border-red-200 pl-4">
              <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">Asset Sent</p>
              <p className="text-xl md:text-2xl font-black tracking-tighter text-red-600">
                {isSell ? `${trade.cryptoAmount} USDT` : `₹${trade.fiatAmount.toLocaleString()}`}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">{trade.sendMethod}</p>
            </div>
            <div className="border-l-2 border-green-200 pl-4">
              <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">Asset Due</p>
              <p className="text-xl md:text-2xl font-black text-blue-600 tracking-tighter">
                {isSell ? `₹${trade.fiatAmount.toLocaleString()}` : `${trade.cryptoAmount} USDT`}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">{trade.receiveMethod}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-[9px] text-gray-500 mb-3 uppercase font-black tracking-widest ml-1">Secure Payout Node</p>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200 group-focus-within:border-blue-300 transition-all">
              <code className="text-xs text-blue-600 font-bold truncate mr-4 font-mono">{trade.walletAddress}</code>
              <button onClick={() => copyToClipboard(trade.walletAddress)} className="text-gray-400 hover:text-gray-600 transition-colors"><Copy size={18} /></button>
            </div>
          </div>
        </div>

        {/* Dynamic Status View */}
        {trade.status === 'PENDING' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-200"><Upload size={20} /></div>
                 <h3 className="text-lg font-black uppercase italic tracking-tighter text-gray-900">Authentication Required</h3>
              </div>
              <p className="text-xs text-gray-600 mb-8 leading-relaxed font-medium">
                Submit your encrypted payment receipt. {isSell ? 'Transfer USDT to the verified platform address provided.' : 'Transfer INR to the merchant endpoint.'}
              </p>

              <label className={`block border-2 border-dashed rounded-[1.5rem] p-10 md:p-14 text-center transition-all cursor-pointer ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50'
              }`}
                onDragOver={(e) => {e.preventDefault(); setDragActive(true)}}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragActive(false)}}
              >
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                {file ? (
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="text-green-600 mb-3" size={32} />
                    <span className="text-sm font-black text-gray-900 truncate max-w-xs">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Select Decrypted Image</span>
                  </>
                )}
              </label>

              {file && (
                <button 
                  onClick={upload} 
                  disabled={loading}
                  className="w-full mt-6 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                >
                  {loading ? 'Initializing...' : 'Confirm Submission'}
                </button>
              )}
            </div>
          </div>
        )}

        {trade.status === 'PAID' && (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
            <div className="w-20 h-20 bg-blue-50 border border-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Clock className="text-blue-600" size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3 text-gray-900">Validation in Progress</h3>
            <p className="text-gray-600 text-sm mb-10 leading-relaxed font-medium max-w-sm mx-auto">
              Our nodes are verifying your {isSell ? 'USDT deposit' : 'INR transfer'}. 
              Assets are locked in escrow and will be released following manual authorization.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 mb-8">
                <div className="text-5xl font-black text-blue-600 mb-2 tracking-tighter">
                {formatTime(timeLeft)}
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Queue TTL Remaining</p>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
              <div 
                className={`h-full transition-all duration-1000 ${phase === '30min' ? 'bg-blue-600' : 'bg-red-500'}`}
                style={{ width: phase === '30min' ? `${Math.min(100, ((1800000 - timeLeft) / 1800000) * 100)}%` : '100%' }}
              />
            </div>
            
            <button onClick={fetchTrade} className="mt-10 flex items-center gap-2 mx-auto text-[10px] text-blue-600 font-black uppercase tracking-widest hover:text-blue-700 transition-colors group">
              <RefreshCw className="group-active:rotate-180 transition-transform" size={14} /> Ping Status
            </button>
          </div>
        )}

        {trade.status === 'COMPLETED' && (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 text-center animate-in zoom-in-95 duration-500 shadow-lg">
            <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3 text-gray-900">Settlement Success</h3>
            <p className="text-gray-600 text-sm mb-10 leading-relaxed font-medium">
              The {isSell ? 'INR payout' : 'USDT release'} has been successfully cleared to your destination endpoint.
            </p>
            
            {trade.txid && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-8 text-left">
                <p className="text-[9px] text-gray-500 uppercase font-black mb-3 tracking-widest">Transaction Integrity Hash</p>
                <code className="text-xs text-green-600 font-mono break-all font-bold tracking-tight">{trade.txid}</code>
              </div>
            )}

            <button onClick={() => navigate('/exchange')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
              New Exchange <ChevronRight size={16} />
            </button>
          </div>
        )}

        {trade.status === 'CANCELLED' && (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 text-center animate-in fade-in duration-500 shadow-lg">
            <div className="w-20 h-20 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="text-red-500" size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3 text-red-500">Node Refusal</h3>
            <p className="text-gray-600 text-sm mb-6">This transaction has been terminated by the protocol.</p>
            {trade.rejectionReason && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 mb-10">
                 <p className="text-red-500 text-xs font-black uppercase tracking-widest mb-1">Termination Logic:</p>
                 <p className="text-sm text-gray-600 italic font-medium">"{trade.rejectionReason}"</p>
              </div>
            )}
            <button onClick={() => navigate('/exchange')} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">
              Restart Exchange
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function RefreshCw({ className, size }) {
    return <Activity className={className} size={size} />
}