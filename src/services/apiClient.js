// Determine API base URL based on environment
const DEV_HOSTS = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0']

const getApiBase = () => {
  // An explicit override always wins — set VITE_API_BASE when the backend
  // lives on a different host to the frontend (separate deploys, staging).
  if (import.meta.env?.VITE_API_BASE) return import.meta.env.VITE_API_BASE

  if (typeof window !== 'undefined' && DEV_HOSTS.includes(window.location.hostname)) {
    // Keep the host the page was opened on: pointing 127.0.0.1 at
    // localhost:5000 (or vice versa) is a cross-origin request and trips CORS.
    return `http://${window.location.hostname}:5000/api`
  }

  // Production: same-origin relative path, assuming the backend is deployed
  // alongside the frontend. Override with VITE_API_BASE if it isn't.
  return '/api'
}

const API_BASE = getApiBase()

export const apiClient = {
  async request(endpoint, options = {}, token = null) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    
    return data
  },

  // Admin endpoints
  admin: {
    async getUsers(token) {
      return apiClient.request('/admin/users', {}, token)
    },
    async deleteUser(userId, token) {
      return apiClient.request(`/admin/users/${userId}`, { method: 'DELETE' }, token)
    },
    async toggleAdmin(userId, token) {
      return apiClient.request(`/admin/users/${userId}/toggle-admin`, { method: 'PUT' }, token)
    },
    async getLogs(token) {
      return apiClient.request('/admin/logs', {}, token)
    },
    async getInterviews(token) {
      return apiClient.request('/admin/interviews', {}, token)
    }
  },

  // Editable site content (team, services, portfolio, posts, courses,
  // about, contact). Reads are public; every write needs an admin token.
  content: {
    async all() {
      return apiClient.request('/content')
    },
    async section(key) {
      return apiClient.request(`/content/${key}`)
    },
    async replace(key, data, token) {
      return apiClient.request(`/content/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ data }),
      }, token)
    },
    async addItem(key, item, token) {
      return apiClient.request(`/content/${key}/items`, {
        method: 'POST',
        body: JSON.stringify({ item }),
      }, token)
    },
    async updateItem(key, id, item, token) {
      return apiClient.request(`/content/${key}/items/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify({ item }),
      }, token)
    },
    async deleteItem(key, id, token) {
      return apiClient.request(`/content/${key}/items/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }, token)
    },
    async reset(key, token) {
      return apiClient.request(`/content/${key}/reset`, { method: 'POST' }, token)
    },
  },

  // Auth endpoints
  auth: {
    async me(token) {
      return apiClient.request('/auth/me', {}, token)
    }
  },

  // Contact endpoints
  contact: {
    async submit(payload) {
      return apiClient.request('/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }
  },

  // Interview / hire requests for a specific team member
  interview: {
    async submit(payload) {
      return apiClient.request('/interview', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }
  }
}
