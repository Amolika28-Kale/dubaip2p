import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getReviews, submitReview } from '../services/reviewService'

export default function Reviews() {
  const { token, user } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchReviews()
  }, [user])

  const fetchReviews = async () => {
    try {
      const d = await getReviews()
      const myReviews = (d.reviews || []).filter(
        r => r.userId?.toString() === user._id
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
      const d = await submitReview({ text, token })
      if (d.review) {
        setReviews([d.review, ...reviews])
        setText('')
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Review</h2>

      {token && (
        <div className="mb-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-3 bg-zinc-900 rounded border border-zinc-700"
            placeholder="Share your experience"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-[#FCD535] rounded disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="p-3 bg-zinc-900 rounded border border-zinc-700">
            <div className="font-bold">{r.username}</div>
            <div className="text-sm text-gray-400">{r.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

