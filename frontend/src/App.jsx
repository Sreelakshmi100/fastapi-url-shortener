import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
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
      const body = { original_url: originalUrl }
      if (customAlias.trim()) {
        body.custom_alias = customAlias.trim()
      }

      const response = await fetch(`${API_URL}/api/v1/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to shorten URL')
      }

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

export default App
