import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Wallet(){
  const { user } = useContext(AuthContext)

  return (
    <div className="p-4 bg-zinc-900 rounded border border-zinc-700">
      <h4 className="font-bold mb-2">Wallet Balance</h4>
      <div className="text-2xl font-bold">${user?.balance || 0}.00</div>
      <div className="text-xs text-gray-400 mt-2">Top up via admin to increase balance</div>
    </div>
  )
}
