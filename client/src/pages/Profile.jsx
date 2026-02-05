import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Profile(){
  const { user, updateProfile } = useContext(AuthContext)
  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const save = async ()=>{
    setLoading(true)
    setMsg('')
    const success = await updateProfile(username, password)
    if(success){
      setMsg('Profile updated successfully')
      setPassword('')
    }else{
      setMsg('Failed to update profile')
    }
    setLoading(false)
  }

  return (
    <div className="p-4 bg-zinc-900 rounded border border-zinc-700">
      <h4 className="font-bold mb-2">Profile Settings</h4>
      <label className="text-xs">Username</label>
      <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full p-2 bg-black/20 rounded mb-2 border border-zinc-700"/>
      <label className="text-xs">New Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 bg-black/20 rounded mb-2 border border-zinc-700"/>
      <div className="flex gap-2">
        <button onClick={save} disabled={loading} className="px-3 py-2 bg-[#FCD535] rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
      </div>
      {msg && <div className={`text-sm mt-2 ${msg.includes('successfully') ? 'text-green-300' : 'text-red-300'}`}>{msg}</div>}
    </div>
  )
}
