const API_BASE = 'https://dubaip2p.onrender.com/api';
// const API_BASE = 'http://localhost:4000/api';

export const getAdminTrades = async (token) => {
  const res = await fetch(`${API_BASE}/exchange/admin/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch admin trades');
  return res.json();
};

export const getExchangeRate = async () => {
  const res = await fetch(`${API_BASE}/exchange/rate`);
  if (!res.ok) throw new Error('Failed to fetch rate');
  return res.json();
};

export const getPaymentDetails = async () => {
  const res = await fetch(`${API_BASE}/exchange/payment-details`);
  if (!res.ok) throw new Error('Failed to fetch payment details');
  return res.json();
};

export const getOperatorStatus = async (token) => {
  const res = await fetch(`${API_BASE}/exchange/admin/operator`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch operator status');
  return res.json();
};

export const toggleOperatorStatus = async (token, currentStatus) => {
  const res = await fetch(`${API_BASE}/exchange/admin/operator`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', // 🔑 Critical: Tells server to expect JSON
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ online: !currentStatus }), // 🔑 Send the toggle value
  });
  if (!res.ok) throw new Error('Failed to toggle operator');
  return res.json();
};

export const getReserves = async () => {
  const res = await fetch(`${API_BASE}/exchange/reserves`);
  if (!res.ok) throw new Error('Failed to fetch reserves');
  return res.json();
};

export const updateExchangeRate = async (token, rate) => {
  const res = await fetch(`${API_BASE}/exchange/admin/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rate }),
  });
  if (!res.ok) throw new Error('Failed to update rate');
  return res.json();
};

export const releaseTrade = async (token, tradeId, txid) => {
  const res = await fetch(`${API_BASE}/exchange/admin/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tradeId, txid }),
  });
  if (!res.ok) throw new Error('Failed to release trade');
  return res.json();
};

export const rejectTrade = async (token, tradeId) => {
  const res = await fetch(`${API_BASE}/exchange/admin/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tradeId }),
  });
  if (!res.ok) throw new Error('Failed to reject trade');
  return res.json();
};

export const savePaymentDetails = async (token, method, details) => {
  const res = await fetch(`${API_BASE}/exchange/admin/payment-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ method, details }),
  });
  if (!res.ok) throw new Error('Failed to save payment details');
  return res.json();
};

export const updateReserves = async (token, reserves) => {
  const res = await fetch(`${API_BASE}/exchange/reserves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reserves }),
  });
  if (!res.ok) throw new Error('Failed to update reserves');
  return res.json();
};
// In adminService.js (ensure the path is correct)
export const getAllUsers = async (token) => {
  const res = await fetch(`${API_BASE}/auth/list`, { // Changed from /admin/user/list to /user/list
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};
