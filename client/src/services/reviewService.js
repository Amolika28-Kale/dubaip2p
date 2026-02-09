const API_BASE = 'https://dubaip2p.onrender.com/api';
// const API_BASE = 'http://localhost:4000/api';


export const getReviews = async () => {
  const res = await fetch(`${API_BASE}/review`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
};

export const submitReview = async ({ text, token }) => {
  const res = await fetch(`${API_BASE}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // ✅ IMPORTANT
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
};

