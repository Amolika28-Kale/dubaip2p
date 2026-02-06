import React, { useEffect, useState, useContext } from 'react'
import { Shield, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

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
    const res = await fetch(
      'https://dubaip2p.onrender.com/api/exchange/admin/list',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const d = await res.json()
    setTrades(d.trades || [])
  }

  const fetchRate = async () => {
    const res = await fetch('https://dubaip2p.onrender.com/api/exchange/rate')
    const d = await res.json()
    setRate(d.rate)
  }

  const fetchPaymentDetails = async () => {
    const res = await fetch('https://dubaip2p.onrender.com/api/exchange/payment-details')
    const d = await res.json()
    setPaymentDetails(d.details || [])
  }

  const fetchOperator = async () => {
    const res = await fetch(
      'https://dubaip2p.onrender.com/api/exchange/admin/operator',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!res.ok) return
    const d = await res.json()
    setOperator(!!d.online)
  }

  const toggleOperator = async () => {
    const res = await fetch(
      'https://dubaip2p.onrender.com/api/exchange/admin/operator',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ online: !operator }),
      }
    )
    const d = await res.json()
    setOperator(!!d.online)
  }

  const fetchReserves = async () => {
    const res = await fetch('https://dubaip2p.onrender.com/api/exchange/reserves')
    const d = await res.json()
    setReserves(d.reserves || {})
    setReservesText(JSON.stringify(d.reserves || {}, null, 2))
  }

  const updateRate = async () => {
    await fetch('https://dubaip2p.onrender.com/api/exchange/admin/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rate }),
    })
    setRateEdit(false)
  }

  const releaseAssets = async (tradeId) => {
    if (!txid) return alert('TXID required')
    setActionLoading(true)

    const res = await fetch(
      'https://dubaip2p.onrender.com/api/exchange/admin/release',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tradeId, txid }),
      }
    )

    const d = await res.json()
    if (d.trade) {
      setSelected(null)
      setTxid('')
      fetchTrades()
    } else {
      alert(d.message || 'Failed')
    }

    setActionLoading(false)
  }

  const rejectTrade = async (tradeId) => {
    if (!window.confirm('Reject this trade?')) return
    setActionLoading(true)

    await fetch('https://dubaip2p.onrender.com/api/exchange/admin/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tradeId }),
    })

    setSelected(null)
    fetchTrades()
    setActionLoading(false)
  }

  const savePaymentDetail = async (method, details) => {
    await fetch(
      'https://dubaip2p.onrender.com/api/exchange/admin/payment-details',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method, details }),
      }
    )
    setEditingMethod(null)
    fetchPaymentDetails()
  }

  const updateReserves = async () => {
    try {
      const parsed = JSON.parse(reservesText)
      await fetch('https://dubaip2p.onrender.com/api/exchange/reserves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reserves: parsed }),
      })
      setReservesEdit(false)
      fetchReserves()
    } catch {
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-yellow-400/30 p-6 rounded w-full max-w-xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-yellow-400 font-bold">Verify Trade</h3>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

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
              onClick={() => rejectTrade(selected._id)}
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
