import { useState } from 'react'
import './App.css'
import AuthPage from './AuthPage'
import ShortenerPage from './ShortenerPage'
import { clearSession, getToken, getUser } from './api'

function App() {
  const [session, setSession] = useState(() => {
    const token = getToken()
    const user = getUser()
    return token && user ? { access_token: token, user } : null
  })

  function handleAuth(nextSession) {
    setSession(nextSession)
  }

  function handleLogout() {
    clearSession()
    setSession(null)
  }

  if (!session) {
    return <AuthPage onAuth={handleAuth} />
  }

  return <ShortenerPage user={session.user} onLogout={handleLogout} />
}

export default App
