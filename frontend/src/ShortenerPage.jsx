import { useState } from 'react'
import { createShortUrl, getToken } from './api'

function ShortenerPage({ user, onLogout }) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    setCopied(false)
    setLoading(true)

    try {
      const data = await createShortUrl({
        originalUrl,
        customAlias,
        token: getToken(),
      })
      setResult(data)
      setOriginalUrl('')
      setCustomAlias('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(result.short_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="app">
      <div className="topbar">
        <span className="user-chip">Hi, {user?.username || 'there'}</span>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>

      <header>
        <h1>URL Shortener</h1>
        <p>Paste a long link and get a short one instantly.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          Long URL
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </label>

        <label>
          Custom alias <span className="optional">(optional)</span>
          <input
            type="text"
            placeholder="my-link"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            maxLength={50}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p className="result-label">Your short URL</p>
          <a href={result.short_url} target="_blank" rel="noreferrer">
            {result.short_url}
          </a>
          <button type="button" className="copy-btn" onClick={copyToClipboard}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ShortenerPage
