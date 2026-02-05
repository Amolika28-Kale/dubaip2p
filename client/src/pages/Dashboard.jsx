import React from 'react'
import MyExchanges from './MyExchanges'
import Wallet from './Wallet'
import Profile from './Profile'

export default function Dashboard(){
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <MyExchanges />
      </div>
      <div className="space-y-6">
        <Wallet />
        <Profile />
      </div>
    </div>
  )
}
