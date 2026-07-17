const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSession({ access_token, user }) {
  localStorage.setItem(TOKEN_KEY, access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function formatError(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
  }
  return 'Something went wrong'
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(formatError(data.detail) || 'Request failed')
  }

  return data
}

export function signup({ username, email, password }) {
  return request('/auth/signup', {
    method: 'POST',
    body: { username, email, password },
  })
}

export function signin({ username, email, password }) {
  const body = { password }
  if (email) body.email = email
  if (username) body.username = username
  return request('/auth/signin', { method: 'POST', body })
}

export function createShortUrl({ originalUrl, customAlias, token }) {
  const body = { original_url: originalUrl }
  if (customAlias?.trim()) {
    body.custom_alias = customAlias.trim()
  }
  return request('/api/v1/urls', {
    method: 'POST',
    body,
    token,
  })
}
