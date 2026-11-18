import { useState } from 'react'
import './App.css'

export default function App() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')
    setProfile(null)

    try {
      const response = await fetch(`https://api.github.com/users/${trimmed}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found')
        }
        throw new Error('Failed to fetch user')
      }
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err.message || 'User not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>GitHub Profile Viewer</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {profile && (
        <div>
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="avatar"
          />
          <h2>{profile.name || profile.login}</h2>
          <p>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{profile.login}
            </a>
          </p>
          {profile.bio && <p>{profile.bio}</p>}
          <p>
            Repos: {profile.public_repos} | Followers: {profile.followers} | Following: {profile.following}
          </p>
        </div>
      )}
    </div>
  )
}
