import React, { useEffect, useState, useContext } from 'react'
import { Send, CreditCard, AlertCircle, Copy, Check } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

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

  useEffect(() => {
    fetchRate()
    fetchPaymentDetails()
  }, [])

  const fetchRate = async () => {
    try {
      const res = await fetch('/api/exchange/rate')
      const data = await res.json()
      if (data.rate) setRate(data.rate)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch('/api/exchange/payment-details')
      const data = await res.json()
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
      const res = await fetch('/api/exchange/initiate', {
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
    if (!file.type.startsWith('image/')) return setError('Please upload an image file')

    setLoading(true)
    const fd = new FormData()
    fd.append('screenshot', file)
    fd.append('tradeId', trade._id)

    try {
      const res = await fetch('/api/exchange/confirm-payment', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      const d = await res.json()
      if (d.trade) setTrade(d.trade)
      else setError(d.message || 'Upload failed')
    } catch (e) {
      setError('Upload failed')
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
            <h2 className="text-xl font-bold">Quick Exchange</h2>
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
                  {sendMethod.includes('UPI') ? (
                    <>
                      <div className="text-sm mb-2">
                        <div className="text-gray-400 text-xs">UPI ID</div>
                        <div className="flex items-center justify-between font-mono text-base">
                          <span>{getPaymentDetail()?.details?.upiId}</span>
                          <button
                            onClick={() => copyToClipboard(getPaymentDetail()?.details?.upiId, 'upi')}
                            className="text-[#FCD535] hover:text-[#FCD535]/80"
                          >
                            {copied === 'upi' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        <div>{getPaymentDetail()?.details?.name}</div>
                        <div>{getPaymentDetail()?.details?.phone}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs space-y-2">
                        <div>
                          <span className="text-gray-400">Account: </span>
                          <span>{getPaymentDetail()?.details?.accountName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Number: </span>
                          <span className="font-mono">{getPaymentDetail()?.details?.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">IFSC: </span>
                          <span className="font-mono">{getPaymentDetail()?.details?.ifsc}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Bank: </span>
                          <span>{getPaymentDetail()?.details?.bankName}</span>
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
                      onChange={(e) => uploadScreenshot(e.target.files[0])}
                      disabled={loading}
                      className="w-full text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Status: PAID -> Waiting for admin */}
              {trade.status === 'PAID' && (
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="text-xs text-purple-300 flex items-center gap-2">
                    <AlertCircle size={14} />
                    Payment received. Waiting for admin verification...
                  </div>
                  {trade.transactionScreenshot && (
                    <img src={trade.transactionScreenshot} alt="proof" className="mt-3 max-h-40 rounded" />
                  )}
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
