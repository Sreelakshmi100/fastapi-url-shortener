import { useState } from 'react'
import { signin, signup, saveSession } from './api'

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        await signup({ username, email, password })
        const session = await signin({ username, password })
        saveSession(session)
        onAuth(session)
        return
      }

      const looksLikeEmail = username.includes('@')
      const session = await signin(
        looksLikeEmail
          ? { email: username, password }
          : { username, password },
      )
      saveSession(session)
      onAuth(session)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setError('')
  }

  return (
    <div className="app auth-app">
      <header>
        <h1>URL Shortener</h1>
        <p>
          {mode === 'login'
            ? 'Sign in to create short links.'
            : 'Create an account to get started.'}
        </p>
      </header>

      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'tab active' : 'tab'}
          onClick={() => switchMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === 'signup' ? 'tab active' : 'tab'}
          onClick={() => switchMode('signup')}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'signup' ? (
          <>
            <label>
              Username
              <input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
          </>
        ) : (
          <label>
            Username or email
            <input
              type="text"
              placeholder="yourname or you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
        )}

        <label>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? mode === 'login'
              ? 'Signing in...'
              : 'Creating account...'
            : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default AuthPage
