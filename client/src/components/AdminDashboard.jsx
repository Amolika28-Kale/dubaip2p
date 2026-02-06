import React, { useEffect, useState, useContext } from 'react'
import { Shield, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function AdminDashboard() {
  const { token, isAdmin } = useContext(AuthContext)
  const [trades, setTrades] = useState([])
  const [selected, setSelected] = useState(null)
  const [txid, setTxid] = useState('')
  const [rate, setRate] = useState('')
  const [rateEdit, setRateEdit] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState([])
  const [editingMethod, setEditingMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reserves, setReserves] = useState({})
  const [reservesEdit, setReservesEdit] = useState(false)
  const [reservesText, setReservesText] = useState('')

  if (!isAdmin) return <div className="text-gray-400 text-center py-10">Admin access required</div>

  useEffect(() => {
    fetchTrades()
    fetchRate()
    fetchPaymentDetails()
    fetchReserves()
    fetchOperator()
  }, [])

  const fetchTrades = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/list', { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) return alert('Unauthorized')
      const d = await res.json()
      setTrades(d.trades || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchRate = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/rate')
      const d = await res.json()
      setRate(d.rate)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/payment-details')
      const d = await res.json()
      setPaymentDetails(d.details || [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchOperator = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/operator', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return
      const d = await res.json()
      // set a local flag
      setOperator(!!d.online)
    } catch (e) { console.error(e) }
  }

  const [operator, setOperator] = useState(false)

  const toggleOperator = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/operator', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ online: !operator })
      })
      const d = await res.json()
      setOperator(!!d.online)
    } catch (e) { alert('Failed to update operator status') }
  }

  const fetchReserves = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/reserves')
      const d = await res.json()
      setReserves(d.reserves || {})
      setReservesText(JSON.stringify(d.reserves || {}, null, 2))
    } catch (e) {
      console.error(e)
    }
  }

  const updateRate = async () => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rate })
      })
      const d = await res.json()
      if (d.rate) setRateEdit(false)
    } catch (e) {
      alert('Failed to update rate')
    }
  }

  const releaseAssets = async (tradeId) => {
    if (!txid) return alert('Enter TXID')
    setLoading(true)
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tradeId, txid })
      })
      const d = await res.json()
      if (d.trade) {
        setSelected(null)
        setTxid('')
        fetchTrades()
      } else alert(d.message || 'Failed to release')
    } catch (e) {
      alert('Request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (tradeId) => {
    if (!confirm('Reject this trade? This will mark trade as CANCELLED.')) return
    setLoading(true)
    try {
      const d = await rejectTradeRequest(tradeId, token)
      if (d.trade) {
        setSelected(null)
        fetchTrades()
      } else alert(d.message || 'Failed to reject')
    } catch (e) {
      alert('Request failed')
    } finally {
      setLoading(false)
    }
  }

  const savePaymentDetail = async (method, details) => {
    try {
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/payment-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ method, details })
      })
      const d = await res.json()
      setEditingMethod(null)
      fetchPaymentDetails()
    } catch (e) {
      alert('Failed to save')
    }
  }

  const updateReserves = async () => {
    try {
      let payload
      try {
        payload = JSON.parse(reservesText)
        setReserves(payload)
        fetchReserves() // refresh to update display
      } catch (e) {
        alert('Invalid JSON format')
        return
      }
      const res = await fetch('https://dubaip2p.onrender.com/api/exchange/reserves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reserves: payload })
      })
      const d = await res.json()
      setReservesEdit(false)
    } catch (e) {
      alert('Failed to update reserves')
    }
  }

  return (
    <div className="space-y-6">
      {/* Rate Management */}
      <div className="bg-black/70 p-6 rounded-lg border border-[#FCD535]/20">
        <h3 className="text-lg font-bold text-[#FCD535] mb-4">Exchange Rate</h3>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">1 USDT = ₹{rate}</div>
          <div className="ml-4">
            <div className="text-xs text-gray-400">Operator</div>
            <div className="mt-1">
              <button onClick={toggleOperator} className={`px-3 py-1 rounded text-sm ${operator ? 'bg-green-600' : 'bg-zinc-700'}`}>
                {operator ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>
          {!rateEdit ? (
            <button
              onClick={() => setRateEdit(true)}
              className="bg-[#FCD535] text-black px-4 py-2 rounded text-sm"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                type="number"
                step="0.01"
                className="p-2 bg-zinc-900 border border-zinc-700 rounded w-24"
              />
              <button onClick={updateRate} className="bg-green-600 px-3 py-2 rounded text-sm">
                Save
              </button>
              <button onClick={() => setRateEdit(false)} className="bg-zinc-700 px-3 py-2 rounded text-sm">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Management */}
      <div className="bg-black/70 p-6 rounded-lg border border-[#FCD535]/20">
        <h3 className="text-lg font-bold text-[#FCD535] mb-4">Payment Details</h3>
        <div className="space-y-3">
          {['UPI', 'BANK'].map((method) => {
            const detail = paymentDetails.find((p) => p.method === method)
            if (editingMethod === method) {
              return (
                <PaymentDetailEditor
                  key={method}
                  method={method}
                  detail={detail}
                  onSave={(details) => savePaymentDetail(method, details)}
                  onCancel={() => setEditingMethod(null)}
                />
              )
            }
            return (
              <div key={method} className="p-3 bg-zinc-900 rounded border border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-[#FCD535]">{method}</div>
                  <button
                    onClick={() => setEditingMethod(method)}
                    className="text-xs bg-[#FCD535] text-black px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </div>
                {detail ? (
                  <div className="text-xs text-gray-400 space-y-1">
                    {method === 'UPI' ? (
                      <>
                        <div>UPI: {detail.details?.upiId}</div>
                        <div>Name: {detail.details?.name}</div>
                        <div>Phone: {detail.details?.phone}</div>
                      </>
                    ) : (
                      <>
                        <div>Account: {detail.details?.accountName}</div>
                        <div>Number: {detail.details?.accountNumber}</div>
                        <div>IFSC: {detail.details?.ifsc}</div>
                        <div>Bank: {detail.details?.bankName}</div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Not configured</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Reserves */}
      <div className="bg-black/70 p-6 rounded-lg border border-[#FCD535]/20">
        <h3 className="text-lg font-bold text-[#FCD535] mb-4">Reserves</h3>
        <div className="space-y-3">
          {Object.entries(reserves).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-300">{key}:</span>
              <span className="text-[#FCD535] font-semibold">{value}</span>
            </div>
          ))}
          {!reservesEdit ? (
            <button onClick={() => { setReservesEdit(true); setReservesText(JSON.stringify(reserves, null, 2)); }} className="bg-[#FCD535] text-black px-3 py-1 rounded text-sm">Edit</button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={reservesText}
                onChange={(e) => setReservesText(e.target.value)}
                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono"
                rows={6}
                placeholder="Enter reserves as JSON object"
              />
              <div className="flex gap-2">
                <button onClick={updateReserves} className="bg-green-600 px-3 py-1 rounded text-sm">Save</button>
                <button onClick={() => setReservesEdit(false)} className="bg-zinc-700 px-3 py-1 rounded text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-black/70 p-6 rounded-lg border border-[#FCD535]/20">
        <h3 className="text-lg font-bold text-[#FCD535] mb-4 flex items-center gap-2">
          <Shield size={20} /> Pending Verifications ({trades.filter((t) => t.status === 'PAID').length})
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trades.map((t) => (
            <div
              key={t._id}
              className={`p-3 rounded border cursor-pointer transition ${
                t.status === 'PAID'
                  ? 'bg-yellow-900/20 border-yellow-500/30 hover:bg-yellow-900/30'
                  : 'bg-zinc-900 border-zinc-700 opacity-60'
              }`}
              onClick={() => t.status === 'PAID' && setSelected(t)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono">{t._id.slice(-8)}</div>
                  <div className="text-xs text-gray-400">
                    {t.sendMethod} → {t.cryptoAmount} USDT | ₹{t.fiatAmount}
                  </div>
                </div>
                <div className={`text-xs font-semibold ${t.status === 'PAID' ? 'text-yellow-300' : 'text-green-300'}`}>
                  {t.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-[#FCD535]/30 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#FCD535]">Verify Payment</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
                <X />
              </button>
            </div>

            {/* Trade Details */}
            <div className="bg-zinc-900 p-3 rounded mb-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Ref ID: </span>
                  <span className="font-mono">{selected._id.slice(-8)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Amount: </span>
                  <span>{selected.cryptoAmount} USDT</span>
                </div>
                <div>
                  <span className="text-gray-400">INR Amount: </span>
                  <span>₹{selected.fiatAmount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Method: </span>
                  <span>{selected.sendMethod}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Wallet: </span>
                  <span className="font-mono text-xs break-all">{selected.walletAddress}</span>
                </div>
              </div>
            </div>

            {/* User Profile Details */}
            {selected.user && (
              <div className="bg-zinc-900 p-3 rounded mb-4">
                <h4 className="text-sm font-semibold text-[#FCD535] mb-2">User Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Username: </span>
                    <span>{selected.user.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email: </span>
                    <span className="break-all">{selected.user.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Balance: </span>
                    <span>₹{selected.user.balance || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Referral Code: </span>
                    <span className="font-mono">{selected.user.referralCode}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Joined: </span>
                    <span>{new Date(selected.user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshot */}
            {selected.transactionScreenshot && (
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Payment Screenshot</div>
                <img src={selected.transactionScreenshot} alt="payment" className="w-full rounded max-h-48 object-cover" />
              </div>
            )}

            {/* Release Assets */}
            <div className="bg-zinc-900 p-4 rounded">
              <label className="block text-sm text-gray-300 mb-2">Transaction Hash (TXID)</label>
              <input
                placeholder="Paste blockchain transaction hash..."
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                className="w-full p-2 bg-black border border-zinc-700 rounded mb-3 text-xs"
              />
              <button
                onClick={() => releaseAssets(selected._id)}
                disabled={loading || !txid}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Release Assets & Complete'}
              </button>
              <button
                onClick={() => handleReject(selected._id)}
                disabled={loading}
                className="w-full mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Reject Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add reject action and reserves management
async function rejectTradeRequest(tradeId, token) {
  const res = await fetch('https://dubaip2p.onrender.com/api/exchange/admin/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tradeId })
  })
  return res.json()
}

// fetch reserves and set reserves inside component via closures

function PaymentDetailEditor({ method, detail, onSave, onCancel }) {
  const [form, setForm] = useState(
    detail?.details || (method === 'UPI' ? { upiId: '', name: '', phone: '' } : { accountName: '', accountNumber: '', ifsc: '', bankName: '' })
  )

  return (
    <div className="p-3 bg-zinc-800 rounded border border-zinc-600">
      <div className="text-sm font-semibold mb-3">{method} Details</div>
      <div className="space-y-2 mb-3">
        {method === 'UPI' ? (
          <>
            <input
              placeholder="UPI ID (e.g. user@upi)"
              value={form.upiId || ''}
              onChange={(e) => setForm({ ...form, upiId: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
            <input
              placeholder="Account Name"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
            <input
              placeholder="Phone"
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
          </>
        ) : (
          <>
            <input
              placeholder="Account Name"
              value={form.accountName || ''}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
            <input
              placeholder="Account Number"
              value={form.accountNumber || ''}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
            <input
              placeholder="IFSC Code"
              value={form.ifsc || ''}
              onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
            <input
              placeholder="Bank Name"
              value={form.bankName || ''}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              className="w-full p-2 bg-black border border-zinc-600 rounded text-xs"
            />
          </>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(form)}
          className="flex-1 bg-green-600 text-white py-1 rounded text-xs hover:bg-green-700"
        >
          Save
        </button>
        <button onClick={onCancel} className="flex-1 bg-zinc-700 text-white py-1 rounded text-xs">
          Cancel
        </button>
      </div>
    </div>
  )
}
