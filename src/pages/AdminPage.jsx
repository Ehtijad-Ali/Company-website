import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Trash2, Shield, ShieldOff, Loader, AlertCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'
import ContentManager from '../components/admin/ContentManager'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const { user, getToken, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/')
      return
    }
    loadData()
  }, [user, navigate])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('No authentication token')

      // Load users
      const usersData = await apiClient.admin.getUsers(token)
      setUsers(usersData.users)

      // Load logs
      const logsData = await apiClient.admin.getLogs(token)
      setLogs(logsData.logs)

      // Load interview requests
      const interviewData = await apiClient.admin.getInterviews(token)
      setInterviews(interviewData.requests)
    } catch (err) {
      setError(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return

    try {
      const token = getToken()
      await apiClient.admin.deleteUser(userId, token)
      setUsers(users.filter(u => u.id !== userId))
      await loadData() // Reload to update logs
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleAdmin = async (userId, username) => {
    try {
      const token = getToken()
      await apiClient.admin.toggleAdmin(userId, token)
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: 1 - u.is_admin } : u))
      await loadData() // Reload to update logs
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen py-20" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="btn btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg flex gap-3" style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('users')}
            className="px-4 py-3 font-medium text-sm transition-colors"
            style={{
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'users' ? `2px solid var(--primary)` : 'none',
              marginBottom: '-1px'
            }}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className="px-4 py-3 font-medium text-sm transition-colors"
            style={{
              color: activeTab === 'logs' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'logs' ? `2px solid var(--primary)` : 'none',
              marginBottom: '-1px'
            }}
          >
            Admin Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className="px-4 py-3 font-medium text-sm transition-colors"
            style={{
              color: activeTab === 'interviews' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'interviews' ? `2px solid var(--primary)` : 'none',
              marginBottom: '-1px'
            }}
          >
            Interview Requests ({interviews.length})
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className="px-4 py-3 font-medium text-sm transition-colors"
            style={{
              color: activeTab === 'content' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'content' ? `2px solid var(--primary)` : 'none',
              marginBottom: '-1px'
            }}
          >
            Site Content
          </button>
        </div>

        {/* Content has its own loading and error handling, and does not
            depend on the user/log/interview fetches above. */}
        {activeTab === 'content' && <ContentManager />}

        {activeTab !== 'content' && (loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-sm">
                  <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th className="px-6 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>Username</th>
                      <th className="px-6 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>Email</th>
                      <th className="px-6 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      <th className="px-6 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>{u.username}</td>
                        <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: u.is_admin ? 'rgba(37, 211, 102, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                              color: u.is_admin ? '#25d366' : '#8b5cf6'
                            }}
                          >
                            {u.is_admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {u.id !== user.id && (
                              <>
                                <button
                                  onClick={() => toggleAdmin(u.id, u.username)}
                                  title={u.is_admin ? 'Demote' : 'Promote'}
                                  className="p-2 rounded hover:opacity-70 transition-opacity"
                                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                >
                                  {u.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => deleteUser(u.id, u.username)}
                                  title="Delete user"
                                  className="p-2 rounded hover:opacity-70 transition-opacity"
                                  style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)' }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-3">
                {logs.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }} className="text-center py-8">No admin logs yet</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="p-4 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {log.admin_username} - <span style={{ color: 'var(--primary)' }}>{log.action}</span>
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{log.details}</p>
                        </div>
                        <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Interview Requests Tab */}
            {activeTab === 'interviews' && (
              <div className="space-y-3">
                {interviews.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }} className="text-center py-8">No interview requests yet</p>
                ) : (
                  interviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {r.name}
                            {r.company && <span style={{ color: 'var(--text-secondary)' }}> · {r.company}</span>}
                          </p>
                          <p className="text-sm">
                            <span style={{ color: 'var(--text-secondary)' }}>wants to interview </span>
                            <span style={{ color: 'var(--primary)' }}>{r.member_name}</span>
                          </p>
                        </div>
                        <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(r.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {r.engagement && <span className="chip">{r.engagement}</span>}
                        {r.budget && <span className="chip">{r.budget}</span>}
                      </div>

                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{r.message}</p>

                      <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Re: interviewing ${r.member_name}`)}`}
                        className="text-sm" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                        {r.email}
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}
