import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CheckCircle, Clock, Upload, AlertCircle, Copy, Eye } from 'lucide-react'
import { getTradeById } from '../services/exchangeService'

export default function TradeStatus(){
  const { tradeId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const [trade, setTrade] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [phase, setPhase] = useState('30min')

  useEffect(()=>{ fetchTrade() }, [])

  useEffect(() => {
    if (trade && trade.status === 'PAID' && trade.paidAt) {
      const paidTime = new Date(trade.paidAt).getTime()
      const now = Date.now()
      const elapsed = now - paidTime
      const thirtyMin = 30 * 60 * 1000
      const seventyTwoHours = 72 * 60 * 60 * 1000

      if (elapsed < thirtyMin) {
        setPhase('30min')
        setTimeLeft(thirtyMin - elapsed)
      } else {
        setPhase('72hr')
        setTimeLeft(seventyTwoHours - elapsed)
      }

      const interval = setInterval(() => {
        const currentElapsed = Date.now() - paidTime
        if (currentElapsed < thirtyMin) {
          setTimeLeft(thirtyMin - currentElapsed)
          setPhase('30min')
        } else {
          setTimeLeft(seventyTwoHours - currentElapsed)
          setPhase('72hr')
        }
        if (timeLeft <= 0) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [trade])

  const fetchTrade = async ()=>{
    try{
      const d = await getTradeById(tradeId)
      if(d.trade) setTrade(d.trade)
    }catch(e){console.error(e)}
  }

  const upload = async ()=>{
    if(!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('screenshot', file)
    fd.append('tradeId', tradeId)
    try{
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/confirm-payment', {
            // const res = await fetch('http://localhost:4000/api/exchange/confirm-payment', {

        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      const d = await res.json()
      if(d.trade) {
        setTrade(d.trade)
      navigate(`/trade/${d.trade._id}`)
      }
    }catch(e){console.error(e)}
    setLoading(false)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  const getProgress = () => {
  if (!trade?.paidAt) return 0

  const paidTime = new Date(trade.paidAt).getTime()
  const now = Date.now()
  const elapsed = now - paidTime
  const thirtyMin = 30 * 60 * 1000

  return Math.min(100, Math.floor((elapsed / thirtyMin) * 100))
}


  if(!trade) return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCD535] mx-auto mb-4"></div>
        <p className="text-gray-400">Loading exchange details...</p>
      </div>
    </div>
  )

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock className="text-yellow-500" size={24} />
      case 'PAID': return <Upload className="text-blue-500" size={24} />
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={24} />
      case 'CANCELLED': return <AlertCircle className="text-red-500" size={24} />
      default: return <Clock className="text-gray-500" size={24} />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FCD535] mb-2">Exchange Status</h1>
          <p className="text-gray-400">Track your P2P exchange progress</p>
        </div>

        {/* Trade Details Card */}
        <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Exchange #{trade._id.slice(-8)}</h3>
              <p className="text-sm text-gray-400">Created {new Date(trade.createdAt).toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(trade.status)}`}>
              {getStatusIcon(trade.status)}
              <span className="font-semibold">{trade.status}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">You Send</label>
                <p className="text-lg font-bold text-red-400">₹{trade.fiatAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{trade.sendMethod}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Exchange Rate</label>
                <p className="text-sm">1 USDT = ₹{trade.rate.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">You Receive</label>
                <p className="text-lg font-bold text-green-400">{trade.cryptoAmount} USDT</p>
                <p className="text-sm text-gray-500">{trade.receiveMethod}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Wallet Address</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-zinc-800 p-2 rounded break-all">
                    {trade.walletAddress}
                  </code>
                  <button
                    onClick={() => copyToClipboard(trade.walletAddress)}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded transition"
                    title="Copy wallet address"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific content */}
        {trade.status === 'PENDING' && (
          <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6">
            <div className="text-center mb-6">
              <Upload className="text-[#FCD535] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-[#FCD535] mb-2">Upload Payment Proof</h3>
              <p className="text-gray-400">Upload a screenshot of your successful payment to proceed</p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                dragActive ? 'border-[#FCD535] bg-[#FCD535]/10' : 'border-zinc-600 hover:border-zinc-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <CheckCircle className="text-green-500 mx-auto" size={48} />
                  <div>
                    <p className="font-semibold text-green-400">{file.name}</p>
                    <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <label className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded cursor-pointer transition">
                      Change File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={upload}
                      disabled={loading}
                      className="px-6 py-2 bg-[#FCD535] text-black font-bold rounded hover:bg-yellow-400 disabled:opacity-50 transition"
                    >
                      {loading ? 'Uploading...' : 'Upload & Submit'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="text-gray-400 mx-auto" size={48} />
                  <div>
                    <p className="text-lg font-semibold mb-2">Drop your payment screenshot here</p>
                    <p className="text-gray-400 mb-4">or click to browse files</p>
                    <label className="inline-block px-6 py-3 bg-[#FCD535] text-black font-bold rounded-lg cursor-pointer hover:bg-yellow-400 transition">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 10MB)</p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Payment Instructions:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Send exactly ₹{trade.fiatAmount.toLocaleString()} to the provided account</li>
                <li>• Include reference #{trade._id.slice(-8)} in payment description if possible</li>
                <li>• Take a clear screenshot showing payment confirmation</li>
                <li>• Upload the screenshot above to complete your exchange</li>
              </ul>
            </div>
          </div>
        )}

    {trade.status === 'PAID' && (
  <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-8 mt-6">
    
    {/* Icon */}
    <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
      <CheckCircle className="text-green-500" size={32} />
    </div>

    {/* Title */}
    <h3 className="text-xl font-bold text-center mb-1">
      Transaction Submitted Successfully!
    </h3>

    <p className="text-center text-gray-400 text-sm mb-6">
      Your payment is being verified.
    </p>

    {/* Transfer ID */}
    <div className="bg-zinc-800 rounded-lg p-3 mb-6 text-center">
      <div className="text-xs text-gray-400 mb-1">Transfer ID</div>
      <div className="font-mono text-green-400">
        {trade._id.slice(-8)}
      </div>
    </div>

    {/* Timer label */}
    <div className="text-center text-sm text-gray-400 mb-1">
      Estimated time to receive USDT
    </div>

    {/* Timer */}
    <div
      className={`text-center text-4xl font-bold mb-2 ${
        phase === '30min' ? 'text-blue-400' : 'text-red-400'
      }`}
    >
      {formatTime(timeLeft)}
    </div>

    {/* Message */}
    {phase === '30min' ? (
      <p className="text-center text-xs text-gray-400 mb-4">
        Your USDT will be automatically sent to your wallet
      </p>
    ) : (
      <p className="text-center text-xs text-red-400 mb-4">
        Something went wrong, verification may take up to 72 hours
      </p>
    )}

    {/* Progress bar */}
    <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden mb-2">
      <div
        className={`h-full transition-all duration-1000 ${
          phase === '30min' ? 'bg-blue-500' : 'bg-red-500'
        }`}
        style={{
          width:
            phase === '30min'
              ? `${Math.min(
                  100,
                  ((30 * 60 * 1000 - timeLeft) /
                    (30 * 60 * 1000)) *
                    100
                )}%`
              : '100%',
        }}
      />
    </div>

    <div className="text-center text-xs text-gray-400">
      {phase === '30min' ? 'Processing…' : 'Delayed'}
    </div>
    {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold"
        >
          Close (Timer continues)
        </button>

        <button
          onClick={fetchTrade}
          className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
        >
          Refresh Status
        </button>
      </div>

      {/* Reminder */}
      <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-left">
        <h4 className="text-yellow-400 font-semibold mb-2">
          Important Reminders
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Do not make another payment for this order</li>
          <li>• USDT will be credited automatically</li>
          <li>• If delayed, admin will manually verify within 72 hours</li>
        </ul>
      </div>
  </div>
)}


        {trade.status === 'COMPLETED' && (
          <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6">
            <div className="text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-green-400 mb-2">Exchange Completed!</h3>
              <p className="text-gray-400 mb-4">Your USDT has been sent to your wallet</p>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Transaction Hash:</span>
                  <button
                    onClick={() => copyToClipboard(trade.txid)}
                    className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded transition"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <code className="text-xs font-mono break-all text-green-300">{trade.txid}</code>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-[#FCD535] text-black font-bold rounded hover:bg-yellow-400 transition"
                >
                  View All Exchanges
                </button>
                <button
                  onClick={() => navigate('/exchange')}
                  className="px-6 py-2 border border-zinc-600 text-gray-300 rounded hover:border-zinc-500 transition"
                >
                  Start New Exchange
                </button>
              </div>
            </div>
          </div>
        )}

        {trade.status === 'CANCELLED' && (
          <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6">
            <div className="text-center">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-red-400 mb-2">Exchange Cancelled</h3>
              <p className="text-gray-400 mb-4">This exchange has been cancelled</p>
              {trade.rejectionReason && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-300">
                    <strong>Reason:</strong> {trade.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

    
      </div>
    </div>
  )
}
