import { useState, useEffect } from 'react'
import type { Repository } from '../services/repositoryService'
import { repositoryService } from '../services/repositoryService'
import PageLayout from './PageLayout'
import ProfileModal from './ProfileModal'
import './RepositoryDetail.css'

interface RepositoryDetailProps {
  repositoryId: string  // Add repositoryId prop
  onBack: () => void
}

function RepositoryDetail({ repositoryId, onBack }: RepositoryDetailProps) {
  const [repository, setRepository] = useState<Repository | null>(null)
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'commits' | 'collaborators' | 'settings'>('overview')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const fetchRepositoryDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Use the repositoryId prop instead of hardcoded '1'
        console.log('Fetching repository with ID:', repositoryId)
        const repoData = await repositoryService.getRepository(repositoryId)
        setRepository(repoData)
        
        // Fetch creator profile (mock data for now)
        setCreator({
          principal: '2vxsx-fae',
          name: 'OpenKeyHub Developer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
          bio: 'Building the future of Web3 development',
          location: 'Internet Computer',
          website: 'https://openkeyhub.com',
          twitter: '@openkeyhub',
          github: 'openkeyhub',
          joinedDate: '2024-01-15',
          repositories: 12,
          followers: 156,
          following: 89,
          contributions: 234
        })
      } catch (err) {
        console.error('Error fetching repository:', err)
        setError(err instanceof Error ? err.message : 'Failed to load repository details')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if we have a repositoryId
    if (repositoryId) {
      fetchRepositoryDetail()
    } else {
      setError('No repository ID provided')
      setLoading(false)
    }
  }, [repositoryId]) // Re-fetch when repositoryId changes

  if (loading) {
    return (
      <PageLayout>
        <div className="repository-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading repository details...</p>
        </div>
      </PageLayout>
    )
  }

  if (error || !repository) {
    return (
      <PageLayout>
        <div className="repository-detail-error">
          <h3>Error Loading Repository</h3>
          <p>{error || 'Repository not found'}</p>
          <button onClick={onBack} className="back-btn">Go Back</button>
        </div>
      </PageLayout>
    )
  }

  // Rest of the component remains the same...
  return (
    <PageLayout>
      <div className="repository-detail-page">
      {/* Repository Header */}
      <div className="repository-header">
        <div className="repository-header-content">
          <div className="repository-breadcrumb">
            <button onClick={onBack} className="back-btn">
              ← Back to Repositories
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="repository-name">{repository.name}</span>
          </div>
          
          <div className="repository-actions">
            <button className="action-btn watch-btn">
              <span>👁️</span>
              <span>Watch</span>
            </button>
            <button className="action-btn star-btn">
              <span>⭐</span>
              <span>Star</span>
            </button>
            <button className="action-btn fork-btn">
              <span>🍴</span>
              <span>Fork</span>
            </button>
            <button className="action-btn deploy-btn">
              <span>🚀</span>
              <span>Deploy</span>
            </button>
          </div>
        </div>
      </div>

      <div className="repository-detail-container">
        {/* Main Content */}
        <div className="repository-main-content">
          {/* Repository Info */}
          <div className="repository-info">
            <div className="repository-title-section">
              <h1 className="repository-title">{repository.name}</h1>
              <span className={`visibility-badge ${repository.visibility}`}>
                {repository.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            
            <p className="repository-description">{repository.description}</p>
            
            <div className="repository-meta">
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">{new Date(repository.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated:</span>
                <span className="meta-value">{new Date(repository.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Language:</span>
                <span className="meta-value">{repository.language || 'Not specified'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">License:</span>
                <span className="meta-value">{repository.license || 'Not specified'}</span>
              </div>
            </div>

            <div className="repository-stats">
              <div className="stat-item">
                <span className="stat-number">{repository.stars || 0}</span>
                <span className="stat-label">Stars</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{repository.forks || 0}</span>
                <span className="stat-label">Forks</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{repository.watchers || 0}</span>
                <span className="stat-label">Watchers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{repository.issues || 0}</span>
                <span className="stat-label">Issues</span>
              </div>
            </div>

            <div className="repository-chains">
              <h3>Supported Chains</h3>
              <div className="chain-badges">
                {repository.chains?.map((chain, index) => (
                  <span key={index} className="chain-badge">
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="repository-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              Files
            </button>
            <button 
              className={`tab-btn ${activeTab === 'commits' ? 'active' : ''}`}
              onClick={() => setActiveTab('commits')}
            >
              Commits
            </button>
            <button 
              className={`tab-btn ${activeTab === 'collaborators' ? 'active' : ''}`}
              onClick={() => setActiveTab('collaborators')}
            >
              Collaborators
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="readme-section">
                  <h2>README.md</h2>
                  <div className="readme-content">
                    <p>Welcome to {repository.name}!</p>
                    <p>This is a comprehensive multichain development project built on OpenKeyHub.</p>
                    
                    <h3>Features</h3>
                    <ul>
                      <li>Multi-chain deployment support</li>
                      <li>Smart contract integration</li>
                      <li>Collaborative development tools</li>
                      <li>Advanced governance features</li>
                    </ul>

                    <h3>Getting Started</h3>
                    <pre><code>git clone {repository.cloneUrl}
cd {repository.name}
npm install
npm start</code></pre>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">📝</span>
                      <span className="activity-text">Updated README.md</span>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">🔧</span>
                      <span className="activity-text">Fixed deployment script</span>
                      <span className="activity-time">1 day ago</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">✨</span>
                      <span className="activity-text">Added new feature</span>
                      <span className="activity-time">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="files-tab">
                <div className="files-header">
                  <h2>Files</h2>
                  <button className="upload-btn">📁 Upload Files</button>
                </div>
                <div className="files-list">
                  <div className="file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-name">README.md</span>
                    <span className="file-size">2.1 KB</span>
                    <span className="file-date">2 hours ago</span>
                  </div>
                  <div className="file-item">
                    <span className="file-icon">📁</span>
                    <span className="file-name">src/</span>
                    <span className="file-size">-</span>
                    <span className="file-date">1 day ago</span>
                  </div>
                  <div className="file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-name">package.json</span>
                    <span className="file-size">1.8 KB</span>
                    <span className="file-date">1 day ago</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commits' && (
              <div className="commits-tab">
                <h2>Commits</h2>
                <div className="commits-list">
                  <div className="commit-item">
                    <div className="commit-info">
                      <span className="commit-hash">a1b2c3d</span>
                      <span className="commit-message">Update README with new features</span>
                    </div>
                    <div className="commit-meta">
                      <span className="commit-author">{creator?.name}</span>
                      <span className="commit-date">2 hours ago</span>
                    </div>
                  </div>
                  <div className="commit-item">
                    <div className="commit-info">
                      <span className="commit-hash">e4f5g6h</span>
                      <span className="commit-message">Fix deployment configuration</span>
                    </div>
                    <div className="commit-meta">
                      <span className="commit-author">{creator?.name}</span>
                      <span className="commit-date">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'collaborators' && (
              <div className="collaborators-tab">
                <div className="collaborators-header">
                  <h2>Collaborators</h2>
                  <button className="invite-btn">👥 Invite Collaborator</button>
                </div>
                <div className="collaborators-list">
                  <div className="collaborator-item">
                    <img src={creator?.avatar} alt={creator?.name} className="collaborator-avatar" />
                    <div className="collaborator-info">
                      <span className="collaborator-name">{creator?.name}</span>
                      <span className="collaborator-role">Owner</span>
                    </div>
                    <div className="collaborator-actions">
                      <button className="role-btn">Admin</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h2>Repository Settings</h2>
                <div className="settings-section">
                  <h3>General</h3>
                  <div className="setting-item">
                    <label>Repository Name</label>
                    <input type="text" value={repository.name} readOnly />
                  </div>
                  <div className="setting-item">
                    <label>Description</label>
                    <textarea value={repository.description} readOnly />
                  </div>
                  <div className="setting-item">
                    <label>Visibility</label>
                    <select value={repository.visibility} disabled>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="repository-sidebar">
          {/* Creator Profile */}
          <div className="creator-profile">
            <div className="profile-header">
              <img src={creator?.avatar} alt={creator?.name} className="profile-avatar" />
              <div className="profile-info">
                <h3 className="profile-name">{creator?.name}</h3>
                <p className="profile-bio">{creator?.bio}</p>
                <span className="profile-location">📍 {creator?.location}</span>
                <button className="action-btn" onClick={() => setIsProfileOpen(true)}>View Profile</button>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-number">{creator?.repositories}</span>
                <span className="stat-label">Repositories</span>
              </div>
              <div className="profile-stat">
                <span className="stat-number">{creator?.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="profile-stat">
                <span className="stat-number">{creator?.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <div className="profile-links">
              {creator?.website && (
                <a href={creator.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🌐 Website
                </a>
              )}
              {creator?.twitter && (
                <a href={`https://twitter.com/${creator.twitter}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🐦 Twitter
                </a>
              )}
              {creator?.github && (
                <a href={`https://github.com/${creator.github}`} target="_blank" rel="noopener noreferrer" className="profile-link">
                  📚 GitHub
                </a>
              )}
            </div>

            <div className="profile-details">
              <p><strong>Principal ID:</strong> {creator?.principal}</p>
              <p><strong>Joined:</strong> {new Date(creator?.joinedDate).toLocaleDateString()}</p>
              <p><strong>Contributions:</strong> {creator?.contributions}</p>
            </div>
          </div>

          {/* Repository Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="quick-action-btn">
              📋 Clone Repository
            </button>
            <button className="quick-action-btn">
              📥 Download ZIP
            </button>
            <button className="quick-action-btn">
              🔗 Share Repository
            </button>
            <button className="quick-action-btn">
              📊 View Analytics
            </button>
          </div>

          {/* Repository Health */}
          <div className="repository-health">
            <h3>Repository Health</h3>
            <div className="health-item">
              <span className="health-label">Code Quality</span>
              <div className="health-bar">
                <div className="health-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="health-score">85%</span>
            </div>
            <div className="health-item">
              <span className="health-label">Security</span>
              <div className="health-bar">
                <div className="health-fill" style={{ width: '92%' }}></div>
              </div>
              <span className="health-score">92%</span>
            </div>
            <div className="health-item">
              <span className="health-label">Documentation</span>
              <div className="health-bar">
                <div className="health-fill" style={{ width: '78%' }}></div>
              </div>
              <span className="health-score">78%</span>
            </div>
          </div>
        </div>
      </div>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} profile={creator} />
      </div>
    </PageLayout>
  )
}

export default RepositoryDetail
