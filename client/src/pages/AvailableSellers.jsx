import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const sellers = [
  {
    name: 'Arjun_Sharma',
    trades: 1248,
    completion: 98.5,
    available: 2750,
    rate: 93.45,
    min: 500,
    max: 50000,
    methods: ['UPI', 'GPay', 'PhonePe']
  },
  {
    name: 'Rahul_Verma',
    trades: 892,
    completion: 97.2,
    available: 1800,
    rate: 93.30,
    min: 1000,
    max: 75000,
    methods: ['UPI', 'Paytm']
  },
  {
    name: 'Neha_Patel',
    trades: 540,
    completion: 99.1,
    available: 3200,
    rate: 93.60,
    min: 500,
    max: 30000,
    methods: ['UPI', 'PhonePe']
  }
]

export default function AvailableSellers() {
    const navigate = useNavigate()
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Available Sellers</h3>
        <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
          View All →
        </span>
      </div>

      <div className="space-y-4">
        {sellers.map((s, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between"
          >
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                  {s.name[0]}
                </div>
                <div className="font-semibold flex items-center gap-1">
                  {s.name}
                  <CheckCircle size={14} className="text-green-500" />
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {s.trades} trades • {s.completion}% completion
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Available: <span className="text-green-400">{s.available} USDT</span>
              </div>
            </div>

            {/* CENTER */}
            <div className="text-sm text-center">
              <div className="text-gray-400 text-xs">Exchange Rate</div>
              <div className="text-lg font-bold">₹{s.rate}</div>
              <div className="text-xs text-gray-500">per USDT</div>
              <div className="text-xs text-gray-400 mt-1">
                Limits ₹{s.min} – ₹{s.max}
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-2">
                {s.methods.join(', ')}
              </div>
              <button onClick={() => navigate("/exchange")}
               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold">
                Buy USDT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
