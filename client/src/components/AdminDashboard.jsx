import React, { useEffect, useState, useContext } from 'react'
import { Shield, X, Users, Star, IndianRupee, History } from 'lucide-react'
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
  updateReserves,
  // Ensure these are added to your adminService
  getAllUsers,
} from '../services/adminService'
import { getReviews } from '../services/reviewService'

export default function AdminDashboard() {
  const { token, isAdmin, loading } = useContext(AuthContext)

  const [trades, setTrades] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [selected, setSelected] = useState(null)
  const [txid, setTxid] = useState('')
  const [rate, setRate] = useState('')
  const [rateEdit, setRateEdit] = useState(false)
  const [operator, setOperator] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('trades') // trades, users, reviews

  /* ================= AUTH GUARDS ================= */
  if (loading) return <div className="text-gray-400 text-center py-10">Loading admin panel…</div>
  if (!isAdmin) return <div className="text-red-400 text-center py-10">Admin access required</div>

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!token) return
    fetchTrades()
    fetchRate()
    fetchOperator()
    fetchUsers()
    fetchReviews()
  }, [token])

  const fetchTrades = async () => {
    try { const d = await getAdminTrades(token); setTrades(d.trades || []) } catch (e) { console.error(e) }
  }

  const fetchUsers = async () => {
    try { const d = await getAllUsers(token); setUsers(d.users || []) } catch (e) { console.error(e) }
  }

  const fetchReviews = async () => {
    try { const d = await getReviews(token); setReviews(d.reviews || []) } catch (e) { console.error(e) }
  }

  const fetchRate = async () => {
    try { const d = await getExchangeRate(); setRate(d.rate) } catch (e) { console.error(e) }
  }

  const toggleOperator = async () => {
    try { const d = await toggleOperatorStatus(token); setOperator(!!d.online) } catch (e) { console.error(e) }
  }

  const fetchOperator = async () => {
    try { const d = await getOperatorStatus(token); setOperator(!!d.online) } catch (e) { console.error(e) }
  }

  const releaseAssets = async (tradeId) => {
    if (!txid) return alert('TXID required');
    setActionLoading(true);
    try {
      const d = await releaseTrade(token, tradeId, txid);
      if (d.trade) { setSelected(null); setTxid(''); fetchTrades(); }
    } catch (e) { alert('Failed to release'); }
    setActionLoading(false);
  }

  return (
    <div className="space-y-6 p-4">
      {/* HEADER STATS & RATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/70 p-6 rounded-lg border border-yellow-400/20">
            <h3 className="text-yellow-400 font-bold mb-3">Exchange Control</h3>
            <div className="flex flex-wrap gap-4 items-center">
                <div className="text-2xl font-bold">₹{rate} <span className="text-xs text-gray-500">/ USDT</span></div>
                <button onClick={toggleOperator} className={`px-3 py-1 rounded text-sm ${operator ? 'bg-green-600' : 'bg-zinc-700'}`}>
                    {operator ? 'System Online' : 'System Offline'}
                </button>
                <button onClick={() => setRateEdit(!rateEdit)} className="bg-yellow-400 text-black px-3 py-1 rounded text-sm">Edit Rate</button>
            </div>
            {rateEdit && (
                <div className="mt-3 flex gap-2">
                    <input value={rate} onChange={(e) => setRate(e.target.value)} className="bg-black border border-zinc-700 px-2 py-1 rounded w-24 text-white" />
                    <button onClick={async () => { await updateExchangeRate(token, rate); setRateEdit(false); }} className="bg-green-600 px-3 py-1 rounded text-sm">Save</button>
                </div>
            )}
        </div>

        <div className="bg-black/70 p-6 rounded-lg border border-yellow-400/20 flex justify-around items-center">
            <div className="text-center">
                <div className="text-gray-400 text-xs">Total Users</div>
                <div className="text-xl font-bold text-yellow-400">{users.length}</div>
            </div>
            <div className="text-center">
                <div className="text-gray-400 text-xs">Pending Trades</div>
                <div className="text-xl font-bold text-red-500">{trades.filter(t => t.status === 'PAID').length}</div>
            </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-800">
        <button onClick={() => setActiveTab('trades')} className={`px-4 py-2 ${activeTab === 'trades' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-500'}`}>Trades</button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-500'}`}>User Management</button>
        <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-500'}`}>Reviews</button>
      </div>

      {/* TAB CONTENT: TRADES */}
      {activeTab === 'trades' && (
        <div className="bg-black/70 p-4 rounded-lg border border-yellow-400/20">
          <h3 className="text-yellow-400 font-bold mb-3 flex gap-2 items-center"><History size={18} /> Recent Trade Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-zinc-800 text-gray-400">
                        <th className="p-2">User / ID</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(t => (
                        <tr key={t._id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                            <td className="p-2">
                                <div className="font-mono text-xs">{t._id.slice(-6)}</div>
                                <div className="text-gray-400">{t.user?.email || 'Unknown'}</div>
                            </td>
                            <td className="p-2">
                                <div className="text-green-500">{t.cryptoAmount} USDT</div>
                                <div className="text-xs text-gray-500">₹{t.fiatAmount}</div>
                            </td>
                            <td className="p-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${t.status === 'PAID' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-gray-400'}`}>
                                    {t.status}
                                </span>
                            </td>
                            <td className="p-2">
                                {t.status === 'PAID' && (
                                    <button onClick={() => setSelected(t)} className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">Verify</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="bg-black/70 p-4 rounded-lg border border-yellow-400/20">
           <h3 className="text-yellow-400 font-bold mb-3 flex gap-2 items-center"><Users size={18} /> Registered Users</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map(u => (
                    <div key={u._id} className="p-3 bg-zinc-900 rounded border border-zinc-800">
                        <div className="font-bold text-sm truncate">{u.email}</div>
                        <div className="flex justify-between mt-2 text-xs">
                            <span className="text-gray-500">Balance:</span>
                            <span className="text-yellow-400 font-bold">₹{u.balance || 0}</span>
                        </div>
                        <div className="text-[10px] text-gray-600 mt-1">Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                ))}
           </div>
        </div>
      )}

{/* TAB CONTENT: REVIEWS */}
{activeTab === 'reviews' && (
  <div className="bg-black/70 p-4 rounded-lg border border-yellow-400/20">
    <h3 className="text-yellow-400 font-bold mb-3 flex gap-2 items-center">
      <Star size={18} /> User Feedback
    </h3>
    <div className="space-y-3">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="p-3 bg-zinc-900 rounded border border-zinc-800">
            <div className="flex gap-1 text-yellow-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < (r.rating || 0) ? "currentColor" : "none"} 
                />
              ))}
            </div>
            {/* 🔑 Changed r.comment to r.text to match your controller */}
            <p className="text-sm italic text-gray-200">"{r.text}"</p>
            {/* 🔑 Using r.username which is stored in your Review model */}
            <div className="text-xs text-gray-500 mt-2">— {r.username || 'Anonymous'}</div>
          </div>
        ))
      )}
    </div>
  </div>
)}

      {/* VERIFICATION MODAL (Keep your existing modal logic here, but styled better) */}
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