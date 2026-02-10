import React, { useEffect, useState, useContext } from 'react'
import { Send, CreditCard, AlertCircle, Copy, Check } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getExchangeRate, getPaymentDetails, initiateExchange, confirmPayment } from '../services/exchangeService'

export default function Home() {
  const { token } = useContext(AuthContext)
  const [sendMethod, setSendMethod] = useState('INR-UPI')
  const [receiveMethod, setReceiveMethod] = useState('USDT-TRC20')
  const [fiatAmount, setFiatAmount] = useState('1000')
  const [cryptoAmount, setCryptoAmount] = useState(0)
  const [rate, setRate] = useState(82.5)
  const [wallet, setWallet] = useState('')
  const [trade, setTrade] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const VERIFY_WINDOW = 30 * 60 * 1000;
const REVIEW_WINDOW = 72 * 60 * 60 * 1000;

const [timeLeft, setTimeLeft] = useState(0);
const [phase, setPhase] = useState(null); // VERIFY | REVIEW
const [paymentFile, setPaymentFile] = useState(null)

const navigate = useNavigate()

useEffect(() => {
  if (!trade || !trade.paidAt || trade.status !== 'PAID') return;

  const paidTime = new Date(trade.paidAt).getTime();

  const interval = setInterval(() => {
    const now = Date.now();
    const diff = now - paidTime;

    if (diff < VERIFY_WINDOW) {
      setPhase('VERIFY');
      setTimeLeft(VERIFY_WINDOW - diff);
    } else {
      setPhase('REVIEW');
      setTimeLeft(REVIEW_WINDOW - (diff - VERIFY_WINDOW));
    }
  }, 1000);

  return () => clearInterval(interval);
}, [trade]);

  useEffect(() => {
    fetchRate()
    fetchPaymentDetails()
  }, [])

  const formatTime = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return h > 0
    ? `${h}h ${m}m`
    : `${m}:${s.toString().padStart(2, '0')}`;
};

  const fetchRate = async () => {
    try {
      const data = await getExchangeRate()
      if (data.rate) setRate(data.rate)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchPaymentDetails = async () => {
    try {
      const data = await getPaymentDetails()
      setPaymentDetails(data.details || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const computed = (parseFloat(fiatAmount || 0) / rate) || 0
    setCryptoAmount(computed.toFixed(6))
  }, [fiatAmount, rate])

  const handleExchange = async () => {
    if (!wallet) return setError('Enter receiving wallet address')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sendMethod,
          receiveMethod,
          fiatAmount: Number(fiatAmount),
          walletAddress: wallet
        })
      })
      const data = await res.json()
      if (data.trade) setTrade(data.trade)
      else setError(data.message || 'Error creating trade')
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }
const uploadScreenshot = async (file) => {
  if (!trade) return setError('No active trade')
  if (!file.type.startsWith('image/')) return setError('Please upload image')

  setLoading(true)
  const fd = new FormData()
  fd.append('screenshot', file)
  fd.append('tradeId', trade._id)

  try {
    const res = await fetch(
      'https://dubaip2p.onrender.com/api/exchange/confirm-payment',
      // 'http://localhost:4000/api/exchange/confirm-payment',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    )

    const d = await res.json()

    if (d.trade) {
      toast.success('Payment proof submitted ✅')

      // 🔥 redirect to Trade Status page
      navigate(`/trade/${d.trade._id}`)
    } else {
      toast.error(d.message || 'Upload failed')
    }
  } catch (e) {
    toast.error('Upload failed')
  } finally {
    setLoading(false)
  }
}


  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const getPaymentDetail = () => {
    return paymentDetails.find((p) => p.method === (sendMethod.includes('UPI') ? 'UPI' : 'BANK'))
  }

  return (
    <div className="space-y-6">
      {/* Calculator Section */}
      <div className="bg-black/70 p-6 rounded-lg border border-[#FCD535]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#FCD535] text-black rounded-lg"><Send size={20} /></div>
          <div>
            <h2 className="text-xl font-bold">Quick Exchanges</h2>
            <p className="text-xs text-gray-400">Direct INR → USDT swap</p>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-400 mt-0.5" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}

          {!trade ? (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-2">You Send (INR)</label>
                <div className="flex gap-2">
                  <input
                    value={fiatAmount}
                    onChange={(e) => setFiatAmount(e.target.value)}
                    className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none"
                    placeholder="10000"
                  />
                  <select
                    value={sendMethod}
                    onChange={(e) => setSendMethod(e.target.value)}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                  >
                    <option>INR-UPI</option>
                    <option>INR-BANK</option>
                  </select>
                </div>
              </div>

              <div className="text-center text-gray-400 text-sm">Rate: 1 USDT = ₹{rate}</div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">You Receive (USDT)</label>
                <div className="flex gap-2">
                  <input
                    value={cryptoAmount}
                    readOnly
                    className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg opacity-60"
                  />
                  <select
                    value={receiveMethod}
                    onChange={(e) => setReceiveMethod(e.target.value)}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                  >
                    <option>USDT-TRC20</option>
                    <option>USDT-BEP20</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Your {receiveMethod} Wallet</label>
                <input
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-[#FCD535] focus:outline-none text-xs"
                  placeholder="Paste your wallet address here..."
                />
              </div>

              <button
                onClick={handleExchange}
                disabled={loading}
                className="w-full bg-[#FCD535] text-black py-3 rounded-lg font-semibold hover:bg-[#FCD535]/90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </>
          ) : (
            <>
              {/* Trade Details */}
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                <div className="text-xs text-gray-400 mb-2">Reference ID</div>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">{trade._id.slice(-12)}</code>
                  <button
                    onClick={() => copyToClipboard(trade._id, 'refid')}
                    className="text-xs text-[#FCD535] hover:text-[#FCD535]/80"
                  >
                    {copied === 'refid' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              {getPaymentDetail() && (
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                    <CreditCard size={14} />
                    Admin {sendMethod.includes('UPI') ? 'UPI' : 'Bank'} Details
                  </div>
               {sendMethod.includes('UPI') && (
  <>
    {/* UPI ID */}
    <div className="text-sm mb-3">
      <div className="text-gray-400 text-xs">UPI ID</div>
      <div className="flex items-center justify-between font-mono text-base">
        <span>{getPaymentDetail()?.details?.upiId}</span>
        <button
          onClick={() =>
            copyToClipboard(getPaymentDetail()?.details?.upiId, 'upi')
          }
          className="text-[#FCD535]"
        >
          {copied === 'upi' ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>

    {/* Admin Name + Phone */}
    <div className="text-xs text-gray-400 mb-4">
      <div>{getPaymentDetail()?.details?.name}</div>
      <div>{getPaymentDetail()?.details?.phone}</div>
    </div>

    {/* 🔥 UPI QR CODE */}
    <div className="flex flex-col items-center gap-2 mt-3">
      <div className="text-xs text-gray-400">Scan & Pay using UPI</div>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          `upi://pay?pa=${getPaymentDetail()?.details?.upiId}&pn=${getPaymentDetail()?.details?.name}&cu=INR`
        )}`}
        alt="Admin UPI QR"
        className="w-44 h-44 rounded-lg border border-zinc-700 bg-white p-2"
      />

      <div className="text-[11px] text-gray-500 text-center">
        After payment, upload screenshot below
      </div>
    </div>
  </>
)}

          
                </div>
              )}

              {/* Status: PENDING -> Upload screenshot */}
              {trade.status === 'PENDING' && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="text-xs text-yellow-300 mb-3">
                    Transfer ₹{trade.fiatAmount} to the account above, then upload proof
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300">Upload Payment Screenshot</label>
                   <input
  type="file"
  accept="image/*"
  onChange={(e) => setPaymentFile(e.target.files[0])}
  disabled={loading}
  className="w-full text-xs"
/>
{paymentFile && (
  <button
    onClick={() => uploadScreenshot(paymentFile)}
    disabled={loading}
    className="mt-3 w-full bg-[#FCD535] text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50"
  >
    {loading ? 'Submitting...' : 'Submit Payment Proof'}
  </button>
)}


                  </div>
                </div>
              )}

{trade.status === 'PAID' && phase === 'VERIFY' && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md text-center">

      <div className="mx-auto w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-4">
        <Check className="text-white" />
      </div>

      <h2 className="text-xl font-bold mb-1">
        Transaction Submitted Successfully!
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Your payment is being verified.  
        You will receive your USDT within the next 30 minutes.
      </p>

      <div className="bg-black/40 border border-zinc-700 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-400">Transfer ID</div>
        <div className="text-sm font-mono text-[#FCD535]">
          {trade._id}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-3xl font-bold text-blue-400">
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs text-gray-400">
          Estimated time to receive USDT
        </div>
      </div>

      <div className="h-2 bg-zinc-700 rounded overflow-hidden mb-4">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{
            width: `${((VERIFY_WINDOW - timeLeft) / VERIFY_WINDOW) * 100}%`
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setTrade({ ...trade })}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm"
        >
          Close (Timer continues)
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm"
        >
          Refresh Status
        </button>
      </div>
    </div>
  </div>
)}

<button
  onClick={() => navigate('/dashboard')}
  className="mt-3 w-full bg-zinc-800 text-white py-2 rounded-lg text-sm hover:bg-zinc-700"
>
  View in My Exchanges →
</button>


{trade.status === 'PAID' && phase === 'REVIEW' && (
  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
    <div className="text-xs text-yellow-300 flex items-center gap-2">
      <AlertCircle size={14} />
      Manual verification required
    </div>

    <div className="mt-3 text-center">
      <div className="text-xl font-bold text-yellow-400">
        {formatTime(timeLeft)}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Verification may take up to 72 hours
      </div>
    </div>
  </div>
)}


              {/* Status: COMPLETED -> Show TXID */}
              {trade.status === 'COMPLETED' && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="text-xs text-green-300 mb-3">✓ Exchange Completed!</div>
                  <div className="text-xs">
                    <div className="text-gray-400 mb-1">Transaction Hash</div>
                    <div className="flex items-center justify-between font-mono bg-black/40 p-2 rounded">
                      <span className="text-green-400 text-xs break-all">{trade.txid}</span>
                      <button
                        onClick={() => copyToClipboard(trade.txid, 'txid')}
                        className="text-[#FCD535] hover:text-[#FCD535]/80 ml-2"
                      >
                        {copied === 'txid' ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setTrade(null)
                  setWallet('')
                  setFiatAmount('1000')
                }}
                className="w-full bg-zinc-800 text-white py-2 rounded-lg text-sm hover:bg-zinc-700"
              >
                New Exchange
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/50 p-4 rounded-lg border border-zinc-700">
          <div className="text-xs text-gray-400 mb-2">USDT Reserve</div>
          <div className="text-lg font-bold">50,000</div>
        </div>
        <div className="bg-black/50 p-4 rounded-lg border border-zinc-700">
          <div className="text-xs text-gray-400 mb-2">Bank Reserve</div>
          <div className="text-lg font-bold">10L INR</div>
        </div>
      </div>
    </div>
  )
}
