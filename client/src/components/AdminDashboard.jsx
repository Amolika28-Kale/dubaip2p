import React, { useEffect, useState, useContext } from 'react'
import { Shield, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import {
  getAdminTrades,
  getExchangeRate,
  getPaymentDetails,
  getOperatorStatus,
  toggleOperatorStatus,
  getReserves,
  updateExchangeRate,
  releaseTrade,
  rejectTrade,
  savePaymentDetails,
  updateReserves
} from '../services/adminService'

export default function AdminDashboard() {
  const { token, isAdmin, loading } = useContext(AuthContext)

  const [trades, setTrades] = useState([])
  const [selected, setSelected] = useState(null)
  const [txid, setTxid] = useState('')
  const [rate, setRate] = useState('')
  const [rateEdit, setRateEdit] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState([])
  const [editingMethod, setEditingMethod] = useState(null)
  const [reserves, setReserves] = useState({})
  const [reservesEdit, setReservesEdit] = useState(false)
  const [reservesText, setReservesText] = useState('')
  const [operator, setOperator] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  /* ================= AUTH GUARDS ================= */
  if (loading) {
    return <div className="text-gray-400 text-center py-10">Loading admin panel…</div>
  }

  if (!isAdmin) {
    return <div className="text-red-400 text-center py-10">Admin access required</div>
  }

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!token) return
    fetchTrades()
    fetchRate()
    fetchPaymentDetails()
    fetchReserves()
    fetchOperator()
  }, [token])

  /* ================= API FUNCTIONS ================= */
  const fetchTrades = async () => {
    try {
      const d = await getAdminTrades(token)
      setTrades(d.trades || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchRate = async () => {
    try {
      const d = await getExchangeRate()
      setRate(d.rate)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchPaymentDetails = async () => {
    try {
      const d = await getPaymentDetails()
      setPaymentDetails(d.details || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchOperator = async () => {
    try {
      const d = await getOperatorStatus(token)
      setOperator(!!d.online)
    } catch (e) {
      console.error(e)
    }
  }

  const toggleOperator = async () => {
    try {
      const d = await toggleOperatorStatus(token)
      setOperator(!!d.online)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchReserves = async () => {
    try {
      const d = await getReserves()
      setReserves(d.reserves || {})
      setReservesText(JSON.stringify(d.reserves || {}, null, 2))
    } catch (e) {
      console.error(e)
    }
  }

  const updateRate = async () => {
    try {
      await updateExchangeRate(token, rate)
      setRateEdit(false)
    } catch (e) {
      console.error(e)
      alert('Failed to update rate')
    }
  }

  const releaseAssets = async (tradeId) => {
    if (!txid) return alert('TXID required')
    setActionLoading(true)

    try {
      const d = await releaseTrade(token, tradeId, txid)
      if (d.trade) {
        setSelected(null)
        setTxid('')
        fetchTrades()
      } else {
        alert(d.message || 'Failed')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to release trade')
    }

    setActionLoading(false)
  }

  const rejectTradeHandler = async (tradeId) => {
    if (!window.confirm('Reject this trade?')) return
    setActionLoading(true)

    try {
      await rejectTrade(token, tradeId)
      setSelected(null)
      fetchTrades()
    } catch (e) {
      console.error(e)
      alert('Failed to reject trade')
    }

    setActionLoading(false)
  }

  const savePaymentDetail = async (method, details) => {
    try {
      await savePaymentDetails(token, method, details)
      setEditingMethod(null)
      fetchPaymentDetails()
    } catch (e) {
      console.error(e)
      alert('Failed to save payment details')
    }
  }

  const updateReservesHandler = async () => {
    try {
      const parsed = JSON.parse(reservesText)
      await updateReserves(token, parsed)
      setReservesEdit(false)
      fetchReserves()
    } catch (e) {
      alert('Invalid JSON')
    }
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* RATE */}
      <div className="bg-black/70 p-6 rounded-lg border border-yellow-400/20">
        <h3 className="text-yellow-400 font-bold mb-3">Exchange Rate</h3>
        <div className="flex gap-4 items-center">
          <div className="text-2xl font-bold">1 USDT = ₹{rate}</div>

          <button
            onClick={toggleOperator}
            className={`px-3 py-1 rounded text-sm ${
              operator ? 'bg-green-600' : 'bg-zinc-700'
            }`}
          >
            {operator ? 'Operator Online' : 'Operator Offline'}
          </button>

          {!rateEdit ? (
            <button
              onClick={() => setRateEdit(true)}
              className="bg-yellow-400 text-black px-3 py-1 rounded"
            >
              Edit
            </button>
          ) : (
            <>
              <input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="bg-black border border-zinc-700 px-2 py-1 rounded w-24"
              />
              <button onClick={updateRate} className="bg-green-600 px-3 py-1 rounded">
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* TRADES */}
      <div className="bg-black/70 p-6 rounded-lg border border-yellow-400/20">
        <h3 className="text-yellow-400 font-bold mb-3 flex gap-2 items-center">
          <Shield size={18} /> Pending Verifications
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trades.map((t) => (
            <div
              key={t._id}
              onClick={() => t.status === 'PAID' && setSelected(t)}
              className={`p-3 rounded cursor-pointer border ${
                t.status === 'PAID'
                  ? 'border-yellow-400/40 bg-yellow-900/20'
                  : 'border-zinc-700 bg-zinc-900 opacity-50'
              }`}
            >
              <div className="flex justify-between text-sm">
                <span className="font-mono">{t._id.slice(-8)}</span>
                <span>{t.status}</span>
              </div>
              <div className="text-xs text-gray-400">
                {t.cryptoAmount} USDT → ₹{t.fiatAmount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-black border border-yellow-400/30 p-6 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-yellow-400 font-bold">Verify Trade - {selected._id.slice(-8)}</h3>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            {/* User Details */}
            {selected.user && (
              <div className="mb-4 p-3 bg-zinc-900 rounded border border-zinc-700">
                <h4 className="text-green-400 font-semibold mb-2">User Details</h4>
                <p><strong>Username:</strong> {selected.user.username || 'N/A'}</p>
                <p><strong>Email:</strong> {selected.user.email}</p>
                <p><strong>Balance:</strong> ₹{selected.user.balance}</p>
                <p><strong>Referral Code:</strong> {selected.user.referralCode}</p>
                <p><strong>Joined:</strong> {new Date(selected.user.createdAt).toLocaleString()}</p>
              </div>
            )}

            {/* Trade Details */}
            <div className="mb-4 p-3 bg-zinc-900 rounded border border-zinc-700">
              <h4 className="text-blue-400 font-semibold mb-2">Trade Details</h4>
              <p><strong>Send Method:</strong> {selected.sendMethod}</p>
              <p><strong>Receive Method:</strong> {selected.receiveMethod}</p>
              <p><strong>Fiat Amount:</strong> ₹{selected.fiatAmount}</p>
              <p><strong>Crypto Amount:</strong> {selected.cryptoAmount} USDT</p>
              <p><strong>Rate:</strong> ₹{selected.rate} per USDT</p>
              <p><strong>Wallet Address:</strong> {selected.walletAddress}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Paid At:</strong> {selected.paidAt ? new Date(selected.paidAt).toLocaleString() : 'N/A'}</p>
              <p><strong>Created:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            </div>

            {/* Screenshot */}
            {selected.transactionScreenshot && (
              <div className="mb-4 p-3 bg-zinc-900 rounded border border-zinc-700">
                <h4 className="text-red-400 font-semibold mb-2">Payment Screenshot</h4>
                <img
                  src={`https://dubaip2p.onrender.com${selected.transactionScreenshot}`}
                  alt="Payment Screenshot"
                  className="w-full max-h-64 object-contain border border-zinc-600 rounded"
                />
              </div>
            )}

            <input
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              placeholder="Blockchain TXID"
              className="w-full bg-black border border-zinc-700 p-2 rounded mb-3 text-xs"
            />

            <button
              disabled={actionLoading}
              onClick={() => releaseAssets(selected._id)}
              className="w-full bg-green-600 py-2 rounded mb-2"
            >
              Release Assets
            </button>

            <button
              disabled={actionLoading}
              onClick={() => rejectTradeHandler(selected._id)}
              className="w-full bg-red-600 py-2 rounded"
            >
              Reject Trade
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
