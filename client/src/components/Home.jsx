import React, { useEffect, useState, useContext } from 'react'
import { Send, CreditCard, AlertCircle, Copy, Check, ArrowUpDown, Upload, QrCode, Wallet, ShieldCheck, Activity } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getExchangeRate, getPaymentDetails, initiateExchange, confirmPayment } from '../services/exchangeService'

export default function Home() {
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()

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

    useEffect(() => {
        fetchRate()
        fetchPaymentDetails()
    }, [])

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
        setWallet('') 
    }

    useEffect(() => {
        if (mode === 'BUY') {
            const computed = (parseFloat(fiatAmount || 0) / rate) || 0
            setCryptoAmount(computed.toFixed(6))
        } else {
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
                type: mode 
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
        const searchKey = sendMethod.includes('USDT') ? sendMethod : sendMethod.split('-')[1];
        return paymentDetails.find(p => p.method === searchKey);
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-6 px-4 md:px-0 pb-10 bg-[#0b0e11]">
            {/* Mode Switcher */}
            <div className="flex bg-[#181a20] p-1.5 rounded-[1.2rem] border border-gray-800 shadow-inner">
                <button 
                    onClick={() => mode !== 'BUY' && toggleMode()} 
                    className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${mode === 'BUY' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Buy USDT
                </button>
                <button 
                    onClick={() => mode !== 'SELL' && toggleMode()} 
                    className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${mode === 'SELL' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Sell USDT
                </button>
            </div>

            <div className="bg-[#181a20] p-6 md:p-10 rounded-[2.5rem] border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
                <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-2xl ${mode === 'BUY' ? 'bg-blue-600/10 text-blue-500' : 'bg-red-600/10 text-red-500'} border border-current opacity-80`}>
                        <ArrowUpDown size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                            {mode === 'BUY' ? 'Buy Crypto' : 'Sell Crypto (Virtual Wallet)'}
                        </h2>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-0.5">
                            {mode === 'BUY' ? 'Send INR, Receive USDT' : 'Deposit USDT to Virtual Escrow'}
                        </p>
                    </div>
                </div>

                {!trade ? (
                    <div className="space-y-6">
                        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-tight flex items-center gap-2 animate-in slide-in-from-top-1"><AlertCircle size={14} /> {error}</div>}

                        {/* Input 1 */}
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-3 font-black uppercase tracking-widest ml-1">You {mode === 'BUY' ? 'Pay' : 'Send'}</label>
                            <div className="flex gap-2 bg-[#0b0e11] p-2 rounded-2xl border border-gray-800 focus-within:border-blue-500/30 transition-all">
                                <input
                                    type="number"
                                    value={mode === 'BUY' ? fiatAmount : cryptoAmount}
                                    onChange={(e) => mode === 'BUY' ? setFiatAmount(e.target.value) : setCryptoAmount(e.target.value)}
                                    className="flex-1 bg-transparent p-3 text-2xl font-black outline-none text-white tracking-tighter"
                                />
                                <select value={sendMethod} onChange={(e) => setSendMethod(e.target.value)} className="bg-[#181a20] border border-gray-800 rounded-xl px-4 text-[11px] font-black text-white outline-none">
                                    {mode === 'BUY' ? (<><option>INR-UPI</option><option>INR-BANK</option></>) : (<><option>USDT-TRC20</option><option>USDT-BEP20</option></>)}
                                </select>
                            </div>
                        </div>

                        <div className="text-center text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] italic">Index: 1 USDT = ₹{mode === 'BUY' ? rate : rate - 1}</div>

                        {/* Input 2 */}
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-3 font-black uppercase tracking-widest ml-1">You Receive</label>
                            <div className="flex gap-2 bg-[#0b0e11]/50 p-2 rounded-2xl border border-gray-800">
                                <input
                                    readOnly
                                    value={mode === 'BUY' ? cryptoAmount : fiatAmount}
                                    className={`flex-1 bg-transparent p-3 text-2xl font-black outline-none tracking-tighter ${mode === 'BUY' ? 'text-green-500' : 'text-blue-500'}`}
                                />
                                <select value={receiveMethod} onChange={(e) => setReceiveMethod(e.target.value)} className="bg-[#181a20]/50 border border-gray-800 rounded-xl px-4 text-[11px] font-black text-gray-600 outline-none">
                                    {mode === 'BUY' ? (<><option>USDT-TRC20</option><option>USDT-BEP20</option></>) : (<><option>INR-UPI</option><option>INR-BANK</option></>)}
                                </select>
                            </div>
                        </div>

                        {/* Wallet / Payout Details */}
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-3 font-black uppercase tracking-widest ml-1">{mode === 'BUY' ? 'Receiving Wallet Address' : 'Your Payout Details (UPI ID / Bank)'}</label>
                            <textarea
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                placeholder={mode === 'BUY' ? "TGTmCX..." : "UPI ID or Bank Details"}
                                className="w-full p-4 bg-[#0b0e11] border border-gray-800 rounded-2xl text-xs h-24 outline-none focus:border-blue-500/50 text-white resize-none font-bold tracking-tight"
                            />
                        </div>

                        <button 
                            onClick={handleExchange} 
                            disabled={loading} 
                            className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 text-xs shadow-xl active:scale-[0.98] ${mode === 'BUY' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20'}`}
                        >
                            {loading ? 'Initializing...' : 'Start Exchange'}
                        </button>
                    </div>
                ) : (
                    /* PAYMENT SECTION */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 🔥 VIRTUAL WALLET UI FOR SELL MODE */}
                        {mode === 'SELL' ? (
                            <div className="space-y-6">
                                <div className="p-5 bg-[#0b0e11] rounded-2xl border border-gray-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Required Deposit</p>
                                        <p className="text-2xl font-black text-red-500 tracking-tighter">{trade.cryptoAmount} USDT</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Network</p>
                                        <p className="text-xs font-black text-white uppercase tracking-widest bg-zinc-800 px-3 py-1 rounded-lg">{trade.sendMethod.split('-')[1]}</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-red-600/[0.02] border border-red-500/20 rounded-[2rem] text-center space-y-6">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-red-600/10 rounded-2xl text-red-500 border border-red-500/20">
                                            <Wallet size={32} />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Platform Escrow Address</p>
                                            <div className="flex items-center justify-between bg-[#0b0e11] p-4 rounded-2xl border border-gray-800 group transition-all">
                                                <code className="text-[10px] md:text-xs text-red-400 font-mono font-bold break-all text-left flex-1">{getAdminPaymentDetail()?.details?.address}</code>
                                                <button onClick={() => copyToClipboard(getAdminPaymentDetail()?.details?.address, 'addr')} className="ml-3 text-zinc-600 hover:text-white transition-colors">
                                                    {copied === 'addr' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-red-500/10 border border-gray-200">
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${getAdminPaymentDetail()?.details?.address}`} className="w-40 h-40 md:w-48 md:h-48" alt="Wallet QR" />
                                        </div>

                                        <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <ShieldCheck size={14} className="stroke-[3px]" /> Escrow Active
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-blue-600/[0.03] border border-blue-500/10 rounded-2xl">
                                    <p className="text-[9px] text-blue-500 font-black uppercase mb-2 tracking-widest italic">Node Instructions:</p>
                                    <ul className="text-[10px] text-gray-500 font-bold space-y-1.5 list-disc list-inside uppercase tracking-tighter">
                                        <li>Transfer exactly {trade.cryptoAmount} USDT.</li>
                                        <li>Capture full success screenshot.</li>
                                        <li>INR release to {trade.receiveMethod} follows confirmation.</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            /* 🏦 Standard BUY Mode UI (UNTOUCHED LOGIC) */
                            <div className="space-y-6">
                                <div className="p-5 bg-[#0b0e11] rounded-2xl border border-gray-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Invoice Total</p>
                                        <p className="text-2xl font-black text-blue-500 tracking-tighter">₹{trade.fiatAmount.toLocaleString()}</p>
                                    </div>
                                    <Activity size={20} className="text-zinc-800" />
                                </div>

                                <div className="p-8 bg-blue-600/[0.02] border border-blue-500/20 rounded-[2rem] space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-blue-500 italic"><CreditCard size={18} /> Payment Interface</h3>
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-full flex justify-between items-center bg-[#0b0e11] p-4 rounded-2xl border border-gray-800 group transition-all">
                                            <span className="text-xs md:text-sm font-mono font-bold text-gray-300 truncate tracking-widest uppercase">{getAdminPaymentDetail()?.details?.upiId}</span>
                                            <button onClick={() => copyToClipboard(getAdminPaymentDetail()?.details?.upiId, 'upi')} className="text-zinc-600 hover:text-white transition-colors">
                                                {copied === 'upi' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-200">
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${getAdminPaymentDetail()?.details?.upiId}&pn=DubaiP2P&cu=INR`)}`} className="w-32 h-32 md:w-44 md:h-44" alt="QR" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Screenshot Upload (Common for both flows) */}
                        <div className="space-y-4">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Upload {mode === 'SELL' ? 'Hash Verification' : 'Receipt Proof'}</label>
                            <div className="relative border-2 border-dashed border-gray-800 rounded-[1.5rem] p-8 text-center hover:border-blue-500/30 bg-[#0b0e11] transition-all cursor-pointer group">
                                <input type="file" accept="image/*" onChange={(e) => setPaymentFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <Upload className="mx-auto text-zinc-700 mb-3 group-hover:text-blue-500 transition-colors" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{paymentFile ? paymentFile.name : 'Select Encrypted Image'}</p>
                            </div>
                            {paymentFile && (
                                <button 
                                    onClick={() => uploadScreenshot(paymentFile)} 
                                    disabled={loading} 
                                    className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-green-700 active:scale-[0.98] transition-all shadow-xl shadow-green-900/20"
                                >
                                    {loading ? 'Verifying...' : 'Finalize Settlement'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>             
        </div>
    )
}