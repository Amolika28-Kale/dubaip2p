import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getReviews, submitReview } from '../services/reviewService'
import { Star, MessageSquare, Send, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Reviews() {
  const { token, user } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(5) // Default to 5 stars

  useEffect(() => {
    if (user) fetchReviews()
  }, [user])

  const fetchReviews = async () => {
    try {
      const d = await getReviews()
      // Use standard id comparison for consistency with your ERP admin logic
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
      // Include rating in the payload
      const d = await submitReview({ text, rating, token })
      if (d.review) {
        setReviews([d.review, ...reviews])
        setText('')
        toast.success('Review submitted successfully!')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to submit review')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-yellow-500/10 rounded-xl text-[#FCD535]">
          <Star size={24} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">My Feedback</h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Share your exchange experience</p>
        </div>
      </div>

      {token && (
        <div className="bg-[#161A1E] p-4 md:p-6 rounded-[2rem] border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className={`transition-colors ${num <= rating ? 'text-yellow-400' : 'text-zinc-700'}`}
                >
                  <Star size={18} fill={num <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <MessageSquare size={16} className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-[#FCD535] transition-colors" />
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-sm text-white outline-none focus:border-yellow-500/50 transition-all resize-none h-32"
              placeholder="Tell us about the speed and reliability of your trade..."
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#FCD535] text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-yellow-500/5"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Post Review <Send size={14} />
              </>
            )}
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Past Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 italic text-sm">You haven't posted any reviews yet.</div>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="p-5 md:p-6 bg-[#161A1E] rounded-3xl border border-zinc-800 shadow-md group transition-all hover:border-zinc-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      size={12} 
                      fill={starIdx < (r.rating || 5) ? "currentColor" : "none"} 
                      className={starIdx < (r.rating || 5) ? "text-yellow-400" : "text-zinc-700"}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
                  <Calendar size={12} />
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">"{r.text}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-6 w-6 bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] font-black text-yellow-400 uppercase border border-zinc-700">
                  {user?.username?.[0] || user?.name?.[0] || 'U'}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verified User</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}