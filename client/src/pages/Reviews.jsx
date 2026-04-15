import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getReviews, submitReview } from '../services/reviewService'
import { Star, MessageSquare, Send, Calendar, Activity, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Reviews() {
  const { token, user } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(5)

  useEffect(() => {
    if (user) fetchReviews()
  }, [user])

  const fetchReviews = async () => {
    try {
      const d = await getReviews()
      const myReviews = (d.reviews || []).filter(
        r => (r.userId?._id || r.userId)?.toString() === user.id
      )
      setReviews(myReviews)
    } catch (e) {
      console.error(e)
    }
  }

  const submit = async () => {
    if (!text || !token) return
    setLoading(true)
    try {
      const d = await submitReview({ text, rating, token })
      if (d.review) {
        setReviews([d.review, ...reviews])
        setText('')
        toast.success('Feedback encrypted & posted')
      }
    } catch (e) {
      console.error(e)
      toast.error('Transmission failed')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 pb-20 bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-200">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Merchant Feedback</h2>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Broadcast your trade experience</p>
          </div>
        </div>
        <Activity size={18} className="text-gray-300 hidden md:block" />
      </div>

      {token && (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-200 shadow-lg space-y-6 transition-all hover:border-blue-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-1">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Protocol Rating:</span>
            <div className="flex gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className={`transition-all transform active:scale-90 ${num <= rating ? 'text-blue-600' : 'text-gray-300'}`}
                >
                  <Star size={20} fill={num <= rating ? "currentColor" : "none"} className={num <= rating ? "drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]" : ""} />
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <MessageSquare size={16} className="absolute left-5 top-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-none h-36 font-bold tracking-tight"
              placeholder="Report on settlement speed, node reliability, or support latency..."
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-50 shadow-md shadow-blue-200"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Authorize Broadcast <Send size={14} className="stroke-[3px]" />
              </>
            )}
          </button>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 mb-2 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Transaction Log ({reviews.length})</h3>
        </div>
        
        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-[2rem] border-dashed shadow-sm">
            <ShieldCheck size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic text-sm">No historical data available in this node.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-6 md:p-8 bg-white rounded-[2rem] border border-gray-200 shadow-md group transition-all hover:border-blue-300 hover:shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
                {/* Decorative ghost icon */}
                <Star size={100} className="absolute -right-8 -bottom-8 text-blue-600 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-10">
                  <div className="flex gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star 
                        key={starIdx} 
                        size={12} 
                        fill={starIdx < (r.rating || 5) ? "currentColor" : "none"} 
                        className={starIdx < (r.rating || 5) ? "text-blue-600" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    <Calendar size={12} className="text-gray-400" />
                    UTC: {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-bold tracking-tight italic mb-8 relative z-10">
                  "{r.text}"
                </p>

                <div className="flex items-center gap-3 pt-6 border-t border-gray-200 relative z-10">
                  <div className="h-9 w-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs font-black text-blue-600 uppercase shadow-inner italic">
                    {user?.username?.[0] || user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-900 tracking-tighter">Verified Node Member</span>
                    <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">End-to-End Encrypted</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] pt-6">
        DubaiP2P Feedback Protocol v1.4
      </p>
    </div>
  )
}