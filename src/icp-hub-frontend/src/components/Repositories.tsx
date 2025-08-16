import { useState, useEffect } from 'react'
import { repositoryService } from '../services/repositoryService'
import type { Repository } from '../services/repositoryService'
import NewRepositoryModal from './NewRepositoryModal'
import RepositoryDetail from './RepositoryDetail'
import ProfileModal, { type ProfileData } from './ProfileModal'
import PageLayout from './PageLayout'
import './Repositories.css'
import { useWallet } from '../services/walletService'

function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedChain, setSelectedChain] = useState('all')
  const [showNewRepoModal, setShowNewRepoModal] = useState(false)
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeProfile, setActiveProfile] = useState<ProfileData | null>(null)

  const [createLoading, setCreateLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { wallet } = useWallet()

  useEffect(() => {
    fetchRepositories()
  }, [])

  const fetchRepositories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await repositoryService.getRepositories()
      setRepositories(response.repositories || [])
    } catch (err) {
      console.error('Error fetching repositories:', err)
      setError('Failed to load repositories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRepository = async (newRepo: {
    name: string
    description: string
    isPrivate: boolean
    supportedChains: string[]
  }) => {
    setCreateLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const repository = await repositoryService.createRepository({
        name: newRepo.name,
        description: newRepo.description,
        visibility: newRepo.isPrivate ? 'private' : 'public',
        chains: newRepo.supportedChains,
        language: undefined,
        license: 'MIT'
      })
      
      setRepositories(prev => [repository, ...prev])
      setShowNewRepoModal(false)
      setSuccessMessage(`Repository "${repository.name}" created successfully!`)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)

    } catch (error) {
      console.error('Failed to create repository:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create repository'
      setError(errorMessage)
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    } finally {
      setCreateLoading(false)
    }
  }

  const handleRepositoryClick = (repository: Repository) => {
    setSelectedRepository(repository)
  }

  const handleBackToRepositories = () => {
    setSelectedRepository(null)
  }

  const openProfile = (ownerName: string) => {
    // Build a lightweight profile from repository owner
    const profile: ProfileData = {
      principal: ownerName,
      name: ownerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(ownerName)}`,
      bio: 'OpenKeyHub user',
      location: 'Internet Computer',
      repositories: repositories.filter(r => r.owner === ownerName).length,
      followers: Math.floor(Math.random() * 500),
      following: Math.floor(Math.random() * 200),
      contributions: Math.floor(Math.random() * 1000)
    }
    setActiveProfile(profile)
    setIsProfileOpen(true)
  }

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage
    const matchesChain = selectedChain === 'all' || repo.chains?.includes(selectedChain)
    
    return matchesSearch && matchesLanguage && matchesChain
  })

  const languages = Array.from(new Set(repositories.map(repo => repo.language).filter(Boolean)))
  const chains = Array.from(new Set(repositories.flatMap(repo => repo.chains || [])))

  if (selectedRepository) {
    return <RepositoryDetail repositoryId={selectedRepository.id} onBack={handleBackToRepositories} />
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="repositories-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading repositories...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="repositories-page">
        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <span>✅</span>
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)}>×</button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>❌</span>
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Header */}
        <div className="repositories-header">
          <div className="header-content">
            <h1 className="repositories-title">Repositories</h1>
            <p className="repositories-subtitle">
              Discover and manage your multichain development projects
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
          >
            <option value="all">All Chains</option>
            {chains.map(chain => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </select>

          <button
            onClick={() => setShowNewRepoModal(true)}
            className="create-repo-btn"
            disabled={createLoading}
          >
            <span>{createLoading ? '⏳' : '➕'}</span>
            <span>{createLoading ? 'Creating...' : 'New Repository'}</span>
          </button>
        </div>

        {/* Connection Warning */}
        {!wallet.connected && (
          <div className="connection-warning">
            <span>⚠️</span>
            <span>Connect your wallet to create repositories</span>
          </div>
        )}

        {/* Repositories List */}
        <div className="repositories-content">
          {filteredRepositories.length === 0 ? (
            <div className="empty-state">
              <h3>No repositories found</h3>
              <p>
                {searchTerm || selectedLanguage !== 'all' || selectedChain !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first repository'}
              </p>
              {!searchTerm && selectedLanguage === 'all' && selectedChain === 'all' && wallet.connected && (
                <button
                  onClick={() => setShowNewRepoModal(true)}
                  className="create-repo-btn"
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating Repository...' : 'Create Repository'}
                </button>
              )}
            </div>
          ) : (
            <div className="repositories-list">
              {filteredRepositories.map((repository) => (
                <div
                  key={repository.id}
                  className="repository-item"
                  onClick={() => handleRepositoryClick(repository)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="repo-header">
                    <div className="repo-title-row">
                      <h3 className="repo-name">{repository.name}</h3>
                      <div className="repo-owner">
                        by
                        <button
                          className="btn-link"
                          onClick={(e) => { e.stopPropagation(); openProfile(repository.owner) }}
                          aria-label={`View ${repository.owner}'s profile`}
                        >
                          {repository.owner}
                        </button>
                      </div>
                    </div>
                    <span className={`repo-visibility ${repository.visibility}`}>
                      {repository.visibility}
                    </span>
                  </div>

                  <div className="repo-actions">
                    <button
                      className="btn-outline"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      aria-label="Star repository"
                    >
                      ⭐ Star {repository.stars || 0}
                    </button>
                  </div>
                  
                  <p className="repo-description">
                    {repository.description || 'No description available'}
                  </p>
                  
                  <div className="repo-meta">
                    <div className="repo-stats">
                      <div className="repo-stat">
                        <span>🍴 {repository.forks || 0}</span>
                      </div>
                      <div className="repo-stat">
                        <span>👁️ {repository.watchers || 0}</span>
                      </div>
                      <div className="repo-stat">
                        <span>📅 {new Date(repository.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {repository.chains && repository.chains.length > 0 && (
                      <div className="repo-chains">
                        {repository.chains.map((chain, index) => (
                          <span key={index} className="chain-badge">
                            {chain}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Repository Modal */}
        <NewRepositoryModal
          isOpen={showNewRepoModal}
          onClose={() => setShowNewRepoModal(false)}
          onSubmit={handleCreateRepository}
        />
        
        <ProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          profile={activeProfile} 
        />
      </div>
    </PageLayout>
  )
}

export default Repositories