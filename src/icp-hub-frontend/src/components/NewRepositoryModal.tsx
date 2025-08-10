import { useState } from 'react'
import './NewRepositoryModal.css'

interface NewRepositoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (repositoryData: {
    name: string
    description: string
    isPrivate: boolean
    supportedChains: string[]
  }) => void
}

function NewRepositoryModal({ isOpen, onClose, onSubmit }: NewRepositoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    supportedChains: [] as string[]
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const availableChains = [
    'Ethereum',
    'Internet Computer',
    'Polygon',
    'BSC',
    'Avalanche',
    'Arbitrum',
    'Optimism',
    'Solana'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleChainToggle = (chain: string) => {
    setFormData(prev => ({
      ...prev,
      supportedChains: prev.supportedChains.includes(chain)
        ? prev.supportedChains.filter(c => c !== chain)
        : [...prev.supportedChains, chain]
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Repository name is required'
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.name)) {
      newErrors.name = 'Repository name can only contain letters, numbers, hyphens, and underscores'
    }

    if (formData.supportedChains.length === 0) {
      newErrors.supportedChains = 'Please select at least one supported blockchain'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      // Reset form
      setFormData({
        name: '',
        description: '',
        isPrivate: false,
        supportedChains: []
      })
      setErrors({})
      onClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      isPrivate: false,
      supportedChains: []
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a new repository</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Repository name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="my-awesome-project"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
            <small>This will be the name of your repository. Use hyphens to separate words.</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="A brief description of your project..."
              rows={3}
            />
            <small>Describe what your project does and what makes it special.</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
              />
              <span className="checkmark"></span>
              Make this repository private
            </label>
            <small>Private repositories are only visible to you and people you share them with.</small>
          </div>

          <div className="form-group">
            <label>Supported Blockchains *</label>
            <div className="chains-grid">
              {availableChains.map(chain => (
                <label key={chain} className="chain-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.supportedChains.includes(chain)}
                    onChange={() => handleChainToggle(chain)}
                  />
                  <span className="chain-checkmark"></span>
                  {chain}
                </label>
              ))}
            </div>
            {errors.supportedChains && (
              <span className="error-message">{errors.supportedChains}</span>
            )}
            <small>Select the blockchain networks your project will support.</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create repository
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewRepositoryModal 