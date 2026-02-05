import React from 'react'

export default function Referral(){
  const code = 'REF-12345'
  const link = `${window.location.origin}/signup?ref=${code}`
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Referral & Rewards</h2>
      <div className="bg-zinc-900 p-4 rounded border border-zinc-700">
        <div className="text-sm text-gray-400 mb-2">Your referral code</div>
        <div className="font-mono text-lg mb-3">{code}</div>
        <div className="text-sm text-gray-400 mb-2">Share link</div>
        <div className="font-mono">{link}</div>
      </div>
    </div>
  )
}
