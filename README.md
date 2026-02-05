# DubaiP2P - Direct Crypto Exchange Platform

A full-stack MERN application for peer-to-peer INR → USDT crypto exchanges with admin verification.

**Features:**
- 🔄 Real-time exchange rate calculator (INR to USDT)
- 📱 Payment method selection (UPI / Bank Transfer)
- 🪙 Blockchain wallet support (USDT TRC20 / BEP20)
- 📸 Screenshot upload for payment proof
- ✅ Admin verification & asset release with transaction hash
- 📊 Admin dashboard for rate & payment details management
- 🎨 Dark theme (Binance-style) with Tailwind CSS & Lucide icons

---

## Project Structure

```
dubaip2p/
├── server/                 # Node.js + Express + MongoDB
│   ├── models/             # Mongoose schemas (Trade, PaymentDetail, Setting)
│   ├── controllers/        # API logic (trade creation, verification, etc)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Admin auth
│   ├── uploads/            # Payment screenshots storage
│   ├── server.js           # Express server entry
│   └── seed.js             # Demo data seeding
├── client/                 # React + Vite
│   ├── src/
│   │   ├── components/     # Home (calculator) & AdminDashboard
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css       # Tailwind entry
│   ├── vite.config.js      # Proxy to backend
│   └── index.html
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)

### 1. Backend Setup

```powershell
cd server
npm install
node seed.js              # Initialize demo data
npm run dev               # Start on http://localhost:4000
```

The backend will:
- ✓ Connect to MongoDB at `mongodb://127.0.0.1:27017/dubaip2p`
- ✓ Seed admin UPI/Bank details, exchange rate (82.5), and sample trades
- ✓ Listen on port 4000

**Environment Variables** (optional `.env` file):
```
MONGO_URI=mongodb://127.0.0.1:27017/dubaip2p
ADMIN_TOKEN=changeme_admin_token
PORT=4000
```

### 2. Frontend Setup

```powershell
cd client
npm install
npm run dev               # Start on http://localhost:5174
```

The frontend will:
- ✓ Run Vite dev server with HMR
- ✓ Proxy `/api` and `/uploads` requests to backend

### 3. Access the App

- **User Interface:** http://localhost:5174
- **Backend API:** http://localhost:4000/api

---

## Demo Credentials & Data

**Admin Token:** `changeme_admin_token`

**Admin Payment Details (pre-seeded):**

| Method | Details |
|--------|---------|
| **UPI** | merchant@okhdfcbank |
| **Bank** | Acc: 1234567890123456, IFSC: HDFC0001234 |

**Exchange Rate:** 1 USDT = ₹82.5

**Sample Trades:**
- 2 COMPLETED trades (with TXID)
- 1 PAID trade (screenshot uploaded, awaiting admin)
- 1 PENDING trade (awaiting screenshot)

---

## Full User Flow

1. **User arrives at home page**
   - Quick Exchange calculator
   - Selects send method (UPI/Bank) and receive method (USDT TRC20/BEP20)
   - Enters INR amount → auto-calculates USDT (using DB rate)

2. **User initiates exchange**
   - Enters crypto wallet address
   - Clicks "Continue to Payment"
   - System creates trade (PENDING status)

3. **User sees payment instructions**
   - Admin UPI/Bank details displayed
   - Transfers INR to admin account

4. **User uploads proof**
   - Takes screenshot of transfer confirmation
   - Uploads screenshot via file input
   - Trade status → PAID

5. **Admin verifies in Dashboard**
   - Sees list of PAID trades (sorted first)
   - Views payment screenshot in modal
   - Enters blockchain transaction hash (TXID)
   - Clicks "Release Assets & Complete"
   - Trade status → COMPLETED

6. **User sees completion**
   - TXID displayed on user screen
   - User can copy TXID to track on blockchain

---

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/exchange/initiate` | Create new trade |
| GET | `/api/exchange/trade/:tradeId` | Fetch trade details |
| POST | `/api/exchange/confirm-payment` | Upload screenshot (multipart) |
| GET | `/api/exchange/payment-details` | Get admin payment info |
| GET | `/api/exchange/latest` | Last 10 trades |
| GET | `/api/exchange/reserves` | USDT & INR reserves |

### Admin Endpoints (require `x-admin-token` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exchange/admin/list` | All trades (PAID first) |
| POST | `/api/exchange/admin/release` | Mark trade as COMPLETED + set TXID |
| GET | `/api/exchange/admin/rate` | Get current rate |
| POST | `/api/exchange/admin/rate` | Update rate |
| POST | `/api/exchange/admin/payment-details` | Set UPI/Bank details |

---

## Database Models

### Trade
```javascript
{
  userId, sendMethod, receiveMethod, fiatAmount, cryptoAmount, rate,
  walletAddress, transactionScreenshot, status, txid, createdAt
}
```

### PaymentDetail
```javascript
{
  method: 'UPI' | 'BANK',
  details: { upiId, name, phone } | { accountName, accountNumber, ifsc, bankName },
  active: boolean
}
```

### Setting
```javascript
{
  key: 'RATE_INR_PER_USDT',
  value: 82.5
}
```

---

## Technologies

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Express.js, Node.js
- **Database:** MongoDB + Mongoose
- **File Upload:** Multer
- **Authentication:** Simple token-based (admin)

---

## Development & Testing

### Test User Flow Locally

1. Go to http://localhost:5174
2. Enter amount (e.g., 10000)
3. Wallet: use any USDT wallet address
4. Click "Continue" → trade created
5. Upload a payment screenshot
6. As admin: switch to Admin Dashboard on same page
7. Edit rate or verify a PAID trade
8. Click trade → modal opens
9. Upload blockchain TXID → marks COMPLETED

### Seed Database Again

```powershell
cd server
node seed.js
```

---

## Production Checklist

- [ ] Set `ADMIN_TOKEN` environment variable (secure token)
- [ ] Configure real MongoDB Atlas connection
- [ ] Enable HTTPS/TLS
- [ ] Add user authentication (JWT)
- [ ] Setup proper file upload/CDN storage
- [ ] Add rate limits & input validation
- [ ] Deploy backend (Vercel, Render, AWS)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Add email notifications for trade status changes
- [ ] Implement blockchain verification (optional)

---

## License

MIT

---

## Support

For issues or questions, please refer to the repository documentation.

