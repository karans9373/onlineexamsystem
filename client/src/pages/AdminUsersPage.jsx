import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminUsers, toggleBlockUser } from '../store/examSlice'
import { GlassPanel } from '../components/GlassPanel'

export default function AdminUsersPage() {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.exam.adminUsers)

  useEffect(() => {
    dispatch(fetchAdminUsers())
  }, [dispatch])

  return (
    <GlassPanel className="p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Admin controls</p>
      <h1 className="mt-2 font-display text-4xl text-white">User governance</h1>
      <div className="thin-scroll mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/8 text-slate-400">
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Verified</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/6">
                <td className="px-3 py-4">{user.full_name}</td>
                <td className="px-3 py-4">{user.email}</td>
                <td className="px-3 py-4 capitalize">{user.role}</td>
                <td className="px-3 py-4">{user.is_verified ? 'Yes' : 'No'}</td>
                <td className="px-3 py-4">{user.is_blocked ? 'Blocked' : 'Active'}</td>
                <td className="px-3 py-4">
                  <button onClick={() => dispatch(toggleBlockUser(user.id))} className="rounded-xl bg-white/8 px-3 py-2 text-xs text-white">
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}
