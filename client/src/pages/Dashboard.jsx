import React from 'react'
import MyExchanges from './MyExchanges'
import Wallet from './Wallet'
import Profile from './Profile'
import AvailableSellers from './AvailableSellers'

export default function Dashboard() {
  return (
    /* Responsive container: Full width on mobile, max-width on desktop */
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* RIGHT COLUMN components (Wallet/Profile) stack FIRST on mobile */}
        <div className="order-1 md:order-2 space-y-6">
          <Wallet />
          <Profile />
        </div>

        {/* LEFT COLUMN (Exchanges) appears under Wallet on mobile */}
        <div className="order-2 md:order-1 md:col-span-2">
          <MyExchanges />
        </div>

      </div>

      {/* Sellers Section - Responsive by design */}
      <div className="order-3">
        <AvailableSellers />
      </div>
      
    </div>
  )
}