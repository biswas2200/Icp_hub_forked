import React, { useState } from 'react'
import './ImportGitHub.css'

const ImportGitHub: React.FC = () => {
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [repositoryName, setRepositoryName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Extract repository name from URL if not provided
      let repoName = repositoryName
      if (!repoName && repositoryUrl) {
        const urlParts = repositoryUrl.split('/')
        repoName = urlParts[urlParts.length - 1].replace('.git', '')
      }

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage(`Successfully imported repository: ${repoName}`)
      setRepositoryUrl('')
      setRepositoryName('')
      setDescription('')
      setIsPrivate(false)
    } catch (error) {
      setMessage('Error importing repository. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const extractRepoInfo = (url: string) => {
    if (url.includes('github.com')) {
      const urlParts = url.split('/')
      const owner = urlParts[urlParts.length - 2]
      const repo = urlParts[urlParts.length - 1].replace('.git', '')
      setRepositoryName(repo)
      setDescription(`Imported from ${owner}/${repo}`)
    }
  }

  return (
    <div className="import-github">
      <div className="import-github-container">
        <div className="import-github-header">
          <h1 className="import-github-title">Import from GitHub</h1>
          <p className="import-github-subtitle">
            Import your existing GitHub repositories to OpenKeyHub and start building multichain applications
          </p>
        </div>

        <div className="import-github-content">
          <div className="import-github-form-section">
            <h2 className="form-section-title">Repository Details</h2>
            <form onSubmit={handleSubmit} className="import-github-form">
              <div className="form-group">
                <label htmlFor="repositoryUrl" className="form-label">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  id="repositoryUrl"
                  value={repositoryUrl}
                  onChange={(e) => {
                    setRepositoryUrl(e.target.value)
                    extractRepoInfo(e.target.value)
                  }}
                  placeholder="https://github.com/username/repository"
                  className="form-input"
                  required
                />
                <small className="form-help">
                  Enter the full GitHub repository URL (HTTPS or SSH)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="repositoryName" className="form-label">
                  Repository Name
                </label>
                <input
                  type="text"
                  id="repositoryName"
                  value={repositoryName}
                  onChange={(e) => setRepositoryName(e.target.value)}
                  placeholder="Repository name"
                  className="form-input"
                />
                <small className="form-help">
                  Will be auto-filled from the URL, but you can customize it
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your repository"
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="checkmark"></span>
                  Make this repository private
                </label>
                <small className="form-help">
                  Private repositories are only visible to you and collaborators
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading || !repositoryUrl}
                >
                  {isLoading ? 'Importing...' : 'Import Repository'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setRepositoryUrl('')
                    setRepositoryName('')
                    setDescription('')
                    setIsPrivate(false)
                    setMessage('')
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>

            {message && (
              <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="import-github-info">
            <h3 className="info-title">What happens when you import?</h3>
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">📥</div>
                <div className="info-content">
                  <h4>Repository Cloning</h4>
                  <p>We'll clone your GitHub repository to OpenKeyHub's secure infrastructure</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🔗</div>
                <div className="info-content">
                  <h4>Git Integration</h4>
                  <p>Maintain full Git history and continue development with our Git tools</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🚀</div>
                <div className="info-content">
                  <h4>Multi-chain Ready</h4>
                  <p>Configure deployments across multiple blockchain networks</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">👥</div>
                <div className="info-content">
                  <h4>Collaboration</h4>
                  <p>Invite team members and manage permissions</p>
                </div>
              </div>
            </div>

            <div className="info-note">
              <h4>Note:</h4>
              <p>
                Importing a repository creates a copy in OpenKeyHub. Your original GitHub repository remains unchanged.
                You can continue to push/pull from GitHub or work entirely within OpenKeyHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportGitHub
