import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getPaymentDetails, initiateExchange } from '../services/exchangeService'
import { ArrowRight, Copy, CheckCircle, Clock, Shield, Zap } from 'lucide-react'

export default function Checkout() {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const sendMethod = params.get('send') || 'INR-UPI'
  const receiveMethod = params.get('receive') || 'USDT-TRC20'
  const fiatAmount = Number(params.get('amount') || 1000)
  const [wallet, setWallet] = useState('')
  const [paymentDetails, setPaymentDetails] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { fetchPaymentDetails() }, [])

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/payment-details')
      const d = await res.json()
      setPaymentDetails(d.details || [])
    } catch (e) { console.error(e) }
  }

  const handleConfirm = async () => {
    if (!wallet) return setError('Enter your receiving wallet address')
    if (!wallet.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/) && !wallet.match(/^0x[a-fA-F0-9]{40}$/) && !wallet.match(/^T[1-9A-HJ-NP-Za-km-z]{33}$/)) {
      return setError('Please enter a valid wallet address')
    }
    setLoading(true); setError('')
    try {
      const data = await initiateExchange(token, { sendMethod, receiveMethod, fiatAmount, walletAddress: wallet })
      if (data.trade) {
        navigate(`/trade/${data.trade._id}`)
      } else setError(data.message || 'Could not create trade')
    } catch (e) { setError('Network error') }
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const adminDetails = paymentDetails.find(p => p.method === (sendMethod.includes('UPI') ? 'UPI' : 'BANK'))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(252,213,53,0.05),transparent_50%)] bg-[radial-gradient(circle_at_80%_80%,rgba(252,213,53,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative max-w-6xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#FCD535]/10 border border-[#FCD535]/20 rounded-full text-[#FCD535] text-sm font-medium mb-4">
            <Shield size={16} className="mr-2" />
            Secure P2P Transaction
          </div>
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#FCD535] to-yellow-400 bg-clip-text text-transparent">
              Confirm Exchange
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Review your transaction details and complete the secure P2P exchange process
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Exchange Summary */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FCD535]/20 rounded-lg flex items-center justify-center">
                  <ArrowRight size={20} className="text-[#FCD535]" />
                </div>
                Exchange Summary
              </h3>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 p-6 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1">You Send</p>
                      <p className="text-3xl font-black text-red-400">₹{fiatAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">{sendMethod.replace('-', ' ')}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <ArrowRight size={24} className="text-red-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1">You Receive</p>
                      <p className="text-3xl font-black text-green-400">{(fiatAmount / 83).toFixed(4)} USDT</p>
                      <p className="text-sm text-gray-500 mt-1">{receiveMethod}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Exchange Rate:</span>
                    <p className="font-bold text-white">1 USDT = ₹83.00</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Processing Time:</span>
                    <p className="font-bold text-white">2-5 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Input */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FCD535]/20 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-[#FCD535]" />
                </div>
                Receiving Wallet
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Your {receiveMethod} Wallet Address
                  </label>
                  <input
                    type="text"
                    value={wallet}
                    onChange={(e)=>setWallet(e.target.value)}
                    placeholder={`Enter your ${receiveMethod} wallet address`}
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-[#FCD535] focus:outline-none text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <Shield size={12} />
                    Make sure this address is correct. Funds sent to wrong address cannot be recovered.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-300 flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={loading || !wallet}
                  className="w-full py-4 bg-gradient-to-r from-[#FCD535] to-yellow-400 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#FCD535]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] text-lg flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Creating Exchange...
                    </>
                  ) : (
                    <>
                      Confirm & Pay
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-6">
            {adminDetails && (
              <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#FCD535] mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Payment Details
                </h3>

                <div className="space-y-4">
                  {sendMethod.includes('UPI') ? (
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-300">UPI ID</span>
                        <button
                          onClick={() => copyToClipboard(adminDetails.details?.upiId)}
                          className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs transition"
                        >
                          {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="font-mono text-lg text-[#FCD535] break-all">
                        {adminDetails.details?.upiId}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Name:</span>
                          <p className="font-semibold">{adminDetails.details?.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Phone:</span>
                          <p className="font-semibold">{adminDetails.details?.phone}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-zinc-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-300">Bank Details</span>
                        <button
                          onClick={() => copyToClipboard(adminDetails.details?.accountNumber)}
                          className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs transition"
                        >
                          {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Account Name:</span>
                          <p className="font-semibold">{adminDetails.details?.accountName}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Account Number:</span>
                          <p className="font-mono text-[#FCD535]">{adminDetails.details?.accountNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">IFSC Code:</span>
                          <p className="font-mono">{adminDetails.details?.ifsc}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Bank Name:</span>
                          <p className="font-semibold">{adminDetails.details?.bankName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Important Instructions
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Send exactly ₹{fiatAmount.toLocaleString()} to the above account</li>
                    <li>• Use UPI app or net banking for instant transfer</li>
                    <li>• Include your reference ID in payment remarks</li>
                    <li>• Take screenshot after successful payment</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#FCD535] mb-4 flex items-center gap-2">
                <Zap size={20} />
                Security & Speed
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm">Instant processing after payment confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm">No hidden fees or charges</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm">24/7 customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm">Secure SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 justify-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 border-2 border-white/20 text-gray-300 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
          >
            Back to Calculator
          </button>
          <button
            onClick={() => navigate('/my-exchanges')}
            className="px-8 py-3 bg-gradient-to-r from-[#FCD535] to-yellow-400 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#FCD535]/25 transition-all duration-300 transform hover:scale-105"
          >
            My Exchanges
          </button>
        </div>
      </div>
    </div>
  )
}
