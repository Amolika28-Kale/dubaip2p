import React, { useEffect, useState, useContext } from 'react'
import { Send, CreditCard, AlertCircle, Copy, Check, ArrowUpDown, Upload, QrCode } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getExchangeRate, getPaymentDetails, initiateExchange, confirmPayment } from '../services/exchangeService'

export default function Home() {
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()

    // Mode Toggle: BUY (INR to USDT) or SELL (USDT to INR)
    const [mode, setMode] = useState('BUY') 
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
    const [paymentFile, setPaymentFile] = useState(null)

    // Timer Logic
    const VERIFY_WINDOW = 30 * 60 * 1000;
    const REVIEW_WINDOW = 72 * 60 * 60 * 1000;
    const [timeLeft, setTimeLeft] = useState(0);
    const [phase, setPhase] = useState(null);

    useEffect(() => {
        fetchRate()
        fetchPaymentDetails()
    }, [])

    // 🔄 Handle Mode Switching
    const toggleMode = () => {
        if (mode === 'BUY') {
            setMode('SELL')
            setSendMethod('USDT-TRC20')
            setReceiveMethod('INR-UPI')
        } else {
            setMode('BUY')
            setSendMethod('INR-UPI')
            setReceiveMethod('USDT-TRC20')
        }
        setWallet('') // Clear wallet/UPI input
    }

    // 📈 Dynamic Calculation based on Mode
    useEffect(() => {
        if (mode === 'BUY') {
            const computed = (parseFloat(fiatAmount || 0) / rate) || 0
            setCryptoAmount(computed.toFixed(6))
        } else {
            // For Sell, we usually use a slightly lower rate (e.g., rate - 1)
            const sellRate = rate - 1 
            const computed = (parseFloat(cryptoAmount || 0) * sellRate) || 0
            setFiatAmount(computed.toFixed(2))
        }
    }, [fiatAmount, cryptoAmount, rate, mode])

    const fetchRate = async () => {
        try {
            const data = await getExchangeRate()
            if (data.rate) setRate(data.rate)
        } catch (e) { console.error(e) }
    }

    const fetchPaymentDetails = async () => {
        try {
            const data = await getPaymentDetails()
            setPaymentDetails(data.details || [])
        } catch (e) { console.error(e) }
    }

    const handleExchange = async () => {
        if (!wallet) return setError(mode === 'BUY' ? 'Enter receiving wallet address' : 'Enter your UPI/Bank details for payout')
        setLoading(true)
        setError('')

        try {
            const payload = {
                sendMethod,
                receiveMethod,
                fiatAmount: Number(fiatAmount),
                cryptoAmount: Number(cryptoAmount),
                walletAddress: wallet,
                type: mode // Send mode to backend
            }
            const res = await fetch('https://dubaip2p.onrender.com/api/exchange/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
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
        if (!trade) return
        setLoading(true)
        const fd = new FormData()
        fd.append('screenshot', file)
        fd.append('tradeId', trade._id)

        try {
            const res = await fetch('https://dubaip2p.onrender.com/api/exchange/confirm-payment', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            })
            const d = await res.json()
            if (d.trade) {
                toast.success('Proof submitted ✅')
                navigate(`/trade/${d.trade._id}`)
            }
        } catch (e) { toast.error('Upload failed') }
        finally { setLoading(false) }
    }

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(''), 2000)
    }

    const getAdminPaymentDetail = () => {
        // Find Admin's payment detail based on what the user is SENDING
        const searchKey = sendMethod.includes('USDT') ? sendMethod : sendMethod.split('-')[1];
        return paymentDetails.find(p => p.method === searchKey);
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-6 px-4 md:px-0">
            {/* Mode Switcher */}
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button onClick={() => mode !== 'BUY' && toggleMode()} className={`flex-1 py-2 text-sm md:text-base rounded-lg font-bold transition ${mode === 'BUY' ? 'bg-[#FCD535] text-black' : 'text-gray-400'}`}>Buy USDT</button>
                <button onClick={() => mode !== 'SELL' && toggleMode()} className={`flex-1 py-2 text-sm md:text-base rounded-lg font-bold transition ${mode === 'SELL' ? 'bg-[#FCD535] text-black' : 'text-gray-400'}`}>Sell USDT</button>
            </div>

            <div className="bg-black/70 p-4 md:p-6 rounded-lg border border-[#FCD535]/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-[#FCD535] text-black rounded-lg"><ArrowUpDown size={20} /></div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold">{mode === 'BUY' ? 'Buy Crypto' : 'Sell Crypto'}</h2>
                        <p className="text-xs text-gray-400">{mode === 'BUY' ? 'Send INR, Receive USDT' : 'Send USDT, Receive INR'}</p>
                    </div>
                </div>

                {!trade ? (
                    <div className="space-y-4">
                        {error && <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>}

                        {/* Input 1 */}
                        <div>
                            <label className="block text-xs text-gray-300 mb-2 font-medium">You {mode === 'BUY' ? 'Pay' : 'Send'}</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={mode === 'BUY' ? fiatAmount : cryptoAmount}
                                    onChange={(e) => mode === 'BUY' ? setFiatAmount(e.target.value) : setCryptoAmount(e.target.value)}
                                    className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-500 outline-none text-white text-sm md:text-base"
                                />
                                <select value={sendMethod} onChange={(e) => setSendMethod(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 md:px-3 text-[10px] md:text-xs">
                                    {mode === 'BUY' ? (<><option>INR-UPI</option><option>INR-BANK</option></>) : (<><option>USDT-TRC20</option><option>USDT-BEP20</option></>)}
                                </select>
                            </div>
                        </div>

                        <div className="text-center text-gray-500 text-xs italic">Exchange Rate: 1 USDT = ₹{mode === 'BUY' ? rate : rate - 1}</div>

                        {/* Input 2 */}
                        <div>
                            <label className="block text-xs text-gray-300 mb-2 font-medium">You Receive</label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={mode === 'BUY' ? cryptoAmount : fiatAmount}
                                    className="flex-1 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-gray-400 text-sm md:text-base"
                                />
                                <select value={receiveMethod} onChange={(e) => setReceiveMethod(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 md:px-3 text-[10px] md:text-xs">
                                    {mode === 'BUY' ? (<><option>USDT-TRC20</option><option>USDT-BEP20</option></>) : (<><option>INR-UPI</option><option>INR-BANK</option></>)}
                                </select>
                            </div>
                        </div>

                        {/* Wallet / Payout Details */}
                        <div>
                            <label className="block text-xs text-gray-300 mb-2 font-medium">{mode === 'BUY' ? 'Receiving Wallet Address' : 'Your Payout Details (UPI ID / Bank)'}</label>
                            <textarea
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                placeholder={mode === 'BUY' ? "TGTmCX..." : "UPI: name@upi or Bank: Acc No, IFSC"}
                                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm h-24 outline-none focus:border-yellow-500 text-white resize-none"
                            />
                        </div>

                        <button onClick={handleExchange} disabled={loading} className="w-full bg-[#FCD535] text-black py-3 md:py-4 rounded-xl font-bold hover:scale-[1.01] transition disabled:opacity-50 text-sm md:text-base">
                            {loading ? 'Processing...' : 'Start Exchange'}
                        </button>
                    </div>
                ) : (
                    /* PAYMENT SECTION */
                    <div className="space-y-6">
                        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                            <p className="text-[10px] text-gray-500 uppercase mb-1">Trade Amount</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
                                {mode === 'BUY' ? `₹${trade.fiatAmount}` : `${trade.cryptoAmount} USDT`}
                            </p>
                        </div>

                        <div className="p-4 md:p-5 bg-blue-900/10 border border-blue-500/30 rounded-xl space-y-4">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-blue-400"><CreditCard size={16} /> Admin Payment Details</h3>
                            
                            {/* UPI Mode */}
                            {mode === 'BUY' && trade.sendMethod.includes('UPI') && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-full flex justify-between items-center bg-black/40 p-3 rounded-lg border border-zinc-800">
                                        <span className="text-xs md:text-sm font-mono truncate mr-2">{getAdminPaymentDetail()?.details?.upiId}</span>
                                        <button onClick={() => copyToClipboard(getAdminPaymentDetail()?.details?.upiId, 'upi')} className="text-yellow-400 shrink-0">
                                            {copied === 'upi' ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg inline-block">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${getAdminPaymentDetail()?.details?.upiId}&pn=Admin&cu=INR`)}`} className="w-32 h-32 md:w-40 md:h-40" alt="QR" />
                                    </div>
                                </div>
                            )}

                            {/* Crypto Sell Mode */}
                            {mode === 'SELL' && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-full text-center">
                                        <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Admin {trade.sendMethod} Address</p>
                                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-zinc-800">
                                            <span className="text-[10px] md:text-xs font-mono break-all text-yellow-500 mr-2">{getAdminPaymentDetail()?.details?.address}</span>
                                            <button onClick={() => copyToClipboard(getAdminPaymentDetail()?.details?.address, 'addr')} className="text-white shrink-0">
                                                {copied === 'addr' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg inline-block">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${getAdminPaymentDetail()?.details?.address}`} className="w-32 h-32 md:w-40 md:h-40" alt="QR" />
                                    </div>
                                    <p className="text-[10px] text-red-400 font-bold bg-red-400/10 px-2 py-1 rounded">⚠️ Send only USDT ({trade.sendMethod.split('-')[1]})</p>
                                </div>
                            )}
                        </div>

                        {/* Screenshot Upload */}
                        <div className="space-y-3">
                            <label className="text-xs text-gray-400 font-medium">Upload Transfer Screenshot</label>
                            <div className="relative border-2 border-dashed border-zinc-800 rounded-xl p-6 text-center hover:border-yellow-500/50 transition-all cursor-pointer">
                                <input type="file" accept="image/*" onChange={(e) => setPaymentFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <Upload className="mx-auto text-gray-600 mb-2" size={32} />
                                <p className="text-xs text-gray-500 truncate">{paymentFile ? paymentFile.name : 'Tap to upload payment proof'}</p>
                            </div>
                            {paymentFile && (
                                <button onClick={() => uploadScreenshot(paymentFile)} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold transition-colors">
                                    {loading ? 'Submitting...' : 'Confirm Payment'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>             
        </div>
    )
}