import { useState, useEffect } from 'react'
import './RepositoryStats.css'

interface RepositoryStats {
  totalRepositories: number
  publicRepositories: number
  totalUsers: number
  totalStars: number
  totalForks: number
}

function RepositoryStats() {
  const [stats, setStats] = useState<RepositoryStats>({
    totalRepositories: 0,
    publicRepositories: 0,
    totalUsers: 0,
    totalStars: 0,
    totalForks: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration - in real app this would come from the backend API
  useEffect(() => {
    const mockStats: RepositoryStats = {
      totalRepositories: 156,
      publicRepositories: 142,
      totalUsers: 89,
      totalStars: 1247,
      totalForks: 89
    }

    // Simulate API call
    setTimeout(() => {
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="repository-stats">
        <div className="stats-header">
          <h2>Repository Statistics</h2>
        </div>
        <div className="loading-spinner">Loading statistics...</div>
      </div>
    )
  }

  return (
    <div className="repository-stats">
      <div className="stats-header">
        <h2>Repository Statistics</h2>
        <p className="stats-subtitle">Platform overview and key metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalRepositories}</div>
            <div className="stat-label">Total Repositories</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-value">{stats.publicRepositories}</div>
            <div className="stat-label">Public Repositories</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalStars}</div>
            <div className="stat-label">Total Stars</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalForks}</div>
            <div className="stat-label">Total Forks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalRepositories - stats.publicRepositories}</div>
            <div className="stat-label">Private Repositories</div>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Public vs Private:</span>
          <div className="summary-bar">
            <div 
              className="summary-fill public" 
              style={{ width: `${(stats.publicRepositories / stats.totalRepositories) * 100}%` }}
            ></div>
          </div>
          <span className="summary-percentage">
            {Math.round((stats.publicRepositories / stats.totalRepositories) * 100)}% Public
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Average Stars per Repository:</span>
          <span className="summary-value">
            {(stats.totalStars / stats.totalRepositories).toFixed(1)}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Average Repositories per User:</span>
          <span className="summary-value">
            {(stats.totalRepositories / stats.totalUsers).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RepositoryStats
