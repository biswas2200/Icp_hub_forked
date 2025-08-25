import { useState, useEffect } from 'react'
import './GitOperations.css'

interface Branch {
  name: string
  commitId: string
  isDefault: boolean
  isCurrent: boolean
  lastCommit: string
  ahead: number
  behind: number
}

interface Commit {
  id: string
  message: string
  author: string
  timestamp: Date
  hash: string
  branch: string
  filesChanged: number
  additions: number
  deletions: number
}



interface GitOperationsProps {
  repositoryId: string
  currentBranch: string
}

function GitOperations({ repositoryId: _repositoryId, currentBranch }: GitOperationsProps) {
  const [activeTab, setActiveTab] = useState<'branches' | 'commits'>('branches')
  const [branches, setBranches] = useState<Branch[]>([])
  const [commits, setCommits] = useState<Commit[]>([])
  const [showCreateBranch, setShowCreateBranch] = useState(false)
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockBranches: Branch[] = [
      {
        name: 'main',
        commitId: 'abc123',
        isDefault: true,
        isCurrent: true,
        lastCommit: 'Update authentication system',
        ahead: 0,
        behind: 0
      },
      {
        name: 'develop',
        commitId: 'def456',
        isDefault: false,
        isCurrent: false,
        lastCommit: 'Add new features',
        ahead: 5,
        behind: 2
      },
      {
        name: 'feature/user-management',
        commitId: 'ghi789',
        isDefault: false,
        isCurrent: false,
        lastCommit: 'Implement user roles',
        ahead: 12,
        behind: 8
      },
      {
        name: 'hotfix/security-patch',
        commitId: 'jkl012',
        isDefault: false,
        isCurrent: false,
        lastCommit: 'Fix authentication vulnerability',
        ahead: 3,
        behind: 1
      }
    ]

    const mockCommits: Commit[] = [
      {
        id: 'abc123',
        message: 'Update authentication system',
        author: 'alice',
        timestamp: new Date('2024-01-16T10:30:00'),
        hash: 'abc123def456',
        branch: 'main',
        filesChanged: 8,
        additions: 156,
        deletions: 23
      },
      {
        id: 'def456',
        message: 'Add new features',
        author: 'bob',
        timestamp: new Date('2024-01-15T15:45:00'),
        hash: 'def456ghi789',
        branch: 'develop',
        filesChanged: 12,
        additions: 234,
        deletions: 45
      },
      {
        id: 'ghi789',
        message: 'Implement user roles',
        author: 'charlie',
        timestamp: new Date('2024-01-14T09:20:00'),
        hash: 'ghi789jkl012',
        branch: 'feature/user-management',
        filesChanged: 15,
        additions: 345,
        deletions: 67
      }
    ]

    setBranches(mockBranches)
    setCommits(mockCommits)
  }, [])



  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getShortHash = (hash: string) => {
    return hash.substring(0, 8)
  }

  return (
    <div className="git-operations">
      <div className="git-operations-header">
        <h2>Git Operations</h2>
        <div className="current-branch">
          <span className="branch-label">Current Branch:</span>
          <span className="branch-name">{currentBranch}</span>
        </div>
      </div>

      <div className="git-tabs">
        <button 
          className={`git-tab ${activeTab === 'branches' ? 'active' : ''}`}
          onClick={() => setActiveTab('branches')}
        >
          🌿 Branches
        </button>
        <button 
          className={`git-tab ${activeTab === 'commits' ? 'active' : ''}`}
          onClick={() => setActiveTab('commits')}
        >
          💾 Commits
        </button>
      </div>

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="git-tab-content">
          <div className="tab-header">
            <h3>Branch Management</h3>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateBranch(true)}
            >
              + New Branch
            </button>
          </div>

          <div className="branches-list">
            {branches.map(branch => (
              <div key={branch.name} className={`branch-item ${branch.isCurrent ? 'current' : ''}`}>
                <div className="branch-info">
                  <div className="branch-name-section">
                    <span className="branch-name">{branch.name}</span>
                    {branch.isDefault && <span className="default-badge">Default</span>}
                    {branch.isCurrent && <span className="current-badge">Current</span>}
                  </div>
                  <div className="branch-details">
                    <span className="commit-hash">{getShortHash(branch.commitId)}</span>
                    <span className="last-commit">{branch.lastCommit}</span>
                  </div>
                </div>
                <div className="branch-status">
                  {branch.ahead > 0 && <span className="ahead">↑ {branch.ahead}</span>}
                  {branch.behind > 0 && <span className="behind">↓ {branch.behind}</span>}
                </div>
                <div className="branch-actions">
                  {!branch.isCurrent && (
                    <button className="btn-secondary">Checkout</button>
                  )}
                  {!branch.isDefault && (
                    <button className="btn-danger">Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commits Tab */}
      {activeTab === 'commits' && (
        <div className="git-tab-content">
          <div className="tab-header">
            <h3>Commit History</h3>
          </div>

          <div className="commits-list">
            {commits.map(commit => (
              <div 
                key={commit.id} 
                className="commit-item"
                onClick={() => setSelectedCommit(commit)}
              >
                <div className="commit-header">
                  <div className="commit-hash">{getShortHash(commit.hash)}</div>
                  <div className="commit-branch">{commit.branch}</div>
                </div>
                <div className="commit-message">{commit.message}</div>
                <div className="commit-meta">
                  <span className="commit-author">👤 {commit.author}</span>
                  <span className="commit-time">{formatDate(commit.timestamp)}</span>
                  <span className="commit-files">📁 {commit.filesChanged} files</span>
                  <span className="commit-changes">
                    <span className="additions">+{commit.additions}</span>
                    <span className="deletions">-{commit.deletions}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Commit Detail Modal */}
      {selectedCommit && (
        <div className="commit-detail-backdrop" onClick={() => setSelectedCommit(null)}>
          <div className="commit-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="commit-detail-header">
              <h3>Commit Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedCommit(null)}
              >
                ✕
              </button>
            </div>
            <div className="commit-detail-content">
              <div className="commit-info">
                <div className="commit-hash-full">{selectedCommit.hash}</div>
                <div className="commit-message-full">{selectedCommit.message}</div>
                <div className="commit-author-full">Author: {selectedCommit.author}</div>
                <div className="commit-time-full">Time: {formatDate(selectedCommit.timestamp)}</div>
                <div className="commit-branch-full">Branch: {selectedCommit.branch}</div>
              </div>
              <div className="commit-stats">
                <div className="stat-item">
                  <span className="stat-label">Files Changed:</span>
                  <span className="stat-value">{selectedCommit.filesChanged}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Additions:</span>
                  <span className="stat-value additions">+{selectedCommit.additions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Deletions:</span>
                  <span className="stat-value deletions">-{selectedCommit.deletions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Branch Modal would go here */}
      {showCreateBranch && (
        <div className="create-branch-backdrop" onClick={() => setShowCreateBranch(false)}>
          <div className="create-branch-modal" onClick={e => e.stopPropagation()}>
            <div className="create-branch-header">
              <h3>Create New Branch</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateBranch(false)}
              >
                ✕
              </button>
            </div>
            <div className="create-branch-content">
              <p>Branch creation form would go here...</p>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default GitOperations
