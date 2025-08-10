import { useState } from 'react'
import { governanceService } from '../services/governanceService'
import type { CreateProposalRequest } from '../services/governanceService'
import { useWallet } from '../services/walletService'
import './CreateProposalModal.css'

interface CreateProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onProposalCreated?: (proposal: any) => void
}

function CreateProposalModal({ isOpen, onClose, onProposalCreated }: CreateProposalModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposalType: 'CustomProposal' as string,
    votingDuration: 7,
    executionDelay: 2
  })
  const [customData, setCustomData] = useState({
    repositoryId: '',
    version: '',
    upgradeDescription: '',
    amount: '',
    recipient: '',
    purpose: '',
    collaborator: '',
    newPermission: 'Read'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { wallet } = useWallet()

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }
    if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    // Validate specific proposal type data
    switch (formData.proposalType) {
      case 'RepositoryUpdate':
        if (!customData.repositoryId.trim()) {
          newErrors.repositoryId = 'Repository ID is required'
        }
        break
      case 'PlatformUpgrade':
        if (!customData.version.trim()) {
          newErrors.version = 'Version is required'
        }
        if (!customData.upgradeDescription.trim()) {
          newErrors.upgradeDescription = 'Upgrade description is required'
        }
        break
      case 'TreasurySpend':
        if (!customData.amount || parseFloat(customData.amount) <= 0) {
          newErrors.amount = 'Valid amount is required'
        }
        if (!customData.recipient.trim()) {
          newErrors.recipient = 'Recipient is required'
        }
        if (!customData.purpose.trim()) {
          newErrors.purpose = 'Purpose is required'
        }
        break
      case 'CollaboratorPromotion':
        if (!customData.repositoryId.trim()) {
          newErrors.repositoryId = 'Repository ID is required'
        }
        if (!customData.collaborator.trim()) {
          newErrors.collaborator = 'Collaborator is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getProposalTypeData = (): any => {
    switch (formData.proposalType) {
      case 'RepositoryUpdate':
        return {
          repositoryId: customData.repositoryId,
          newSettings: {}
        }
      case 'PlatformUpgrade':
        return {
          version: customData.version,
          description: customData.upgradeDescription
        }
      case 'TreasurySpend':
        return {
          amount: parseFloat(customData.amount),
          recipient: customData.recipient,
          purpose: customData.purpose
        }
      case 'GovernanceConfig':
        return {
          newConfig: {
            votingPeriod: formData.votingDuration * 24 * 60 * 60 * 1000,
            executionDelay: formData.executionDelay * 24 * 60 * 60 * 1000,
            proposalDeposit: 100,
            quorumPercentage: 10.0,
            approvalThreshold: 60.0,
            maxProposalsPerUser: 5,
            minVotingPower: 100,
            allowDelegation: true
          }
        }
      case 'CollaboratorPromotion':
        return {
          repositoryId: customData.repositoryId,
          collaborator: customData.collaborator,
          newPermission: customData.newPermission
        }
      case 'CustomProposal':
        return {
          title: formData.title,
          description: formData.description
        }
      default:
        return {}
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.connected) {
      setErrors({ wallet: 'Please connect your wallet to create a proposal' })
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const proposalData: CreateProposalRequest = {
        proposalType: {
          type: formData.proposalType as any,
          data: getProposalTypeData()
        },
        title: formData.title,
        description: formData.description,
        votingDuration: formData.votingDuration * 24 * 60 * 60 * 1000, // Convert to milliseconds
        executionDelay: formData.executionDelay * 24 * 60 * 60 * 1000
      }

      const newProposal = await governanceService.createProposal(proposalData)
      
      onProposalCreated?.(newProposal)
      handleClose()
    } catch (error) {
      console.error('Error creating proposal:', error)
      setErrors({ submit: 'Failed to create proposal. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      proposalType: 'CustomProposal',
      votingDuration: 7,
      executionDelay: 2
    })
    setCustomData({
      repositoryId: '',
      version: '',
      upgradeDescription: '',
      amount: '',
      recipient: '',
      purpose: '',
      collaborator: '',
      newPermission: 'Read'
    })
    setErrors({})
    setLoading(false)
    onClose()
  }

  const renderProposalTypeFields = () => {
    switch (formData.proposalType) {
      case 'RepositoryUpdate':
        return (
          <div className="form-group">
            <label htmlFor="repositoryId">Repository ID *</label>
            <input
              type="text"
              id="repositoryId"
              value={customData.repositoryId}
              onChange={(e) => setCustomData({ ...customData, repositoryId: e.target.value })}
              placeholder="Enter repository ID"
              className={errors.repositoryId ? 'error' : ''}
            />
            {errors.repositoryId && <span className="error-message">{errors.repositoryId}</span>}
          </div>
        )

      case 'PlatformUpgrade':
        return (
          <>
            <div className="form-group">
              <label htmlFor="version">Version *</label>
              <input
                type="text"
                id="version"
                value={customData.version}
                onChange={(e) => setCustomData({ ...customData, version: e.target.value })}
                placeholder="e.g., 2.0.0"
                className={errors.version ? 'error' : ''}
              />
              {errors.version && <span className="error-message">{errors.version}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="upgradeDescription">Upgrade Description *</label>
              <textarea
                id="upgradeDescription"
                value={customData.upgradeDescription}
                onChange={(e) => setCustomData({ ...customData, upgradeDescription: e.target.value })}
                placeholder="Describe the platform upgrade"
                rows={3}
                className={errors.upgradeDescription ? 'error' : ''}
              />
              {errors.upgradeDescription && <span className="error-message">{errors.upgradeDescription}</span>}
            </div>
          </>
        )

      case 'TreasurySpend':
        return (
          <>
            <div className="form-group">
              <label htmlFor="amount">Amount (Tokens) *</label>
              <input
                type="number"
                id="amount"
                value={customData.amount}
                onChange={(e) => setCustomData({ ...customData, amount: e.target.value })}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient">Recipient *</label>
              <input
                type="text"
                id="recipient"
                value={customData.recipient}
                onChange={(e) => setCustomData({ ...customData, recipient: e.target.value })}
                placeholder="Enter recipient address"
                className={errors.recipient ? 'error' : ''}
              />
              {errors.recipient && <span className="error-message">{errors.recipient}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="purpose">Purpose *</label>
              <textarea
                id="purpose"
                value={customData.purpose}
                onChange={(e) => setCustomData({ ...customData, purpose: e.target.value })}
                placeholder="Describe the purpose of this spending"
                rows={3}
                className={errors.purpose ? 'error' : ''}
              />
              {errors.purpose && <span className="error-message">{errors.purpose}</span>}
            </div>
          </>
        )

      case 'CollaboratorPromotion':
        return (
          <>
            <div className="form-group">
              <label htmlFor="repositoryId">Repository ID *</label>
              <input
                type="text"
                id="repositoryId"
                value={customData.repositoryId}
                onChange={(e) => setCustomData({ ...customData, repositoryId: e.target.value })}
                placeholder="Enter repository ID"
                className={errors.repositoryId ? 'error' : ''}
              />
              {errors.repositoryId && <span className="error-message">{errors.repositoryId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="collaborator">Collaborator *</label>
              <input
                type="text"
                id="collaborator"
                value={customData.collaborator}
                onChange={(e) => setCustomData({ ...customData, collaborator: e.target.value })}
                placeholder="Enter collaborator address"
                className={errors.collaborator ? 'error' : ''}
              />
              {errors.collaborator && <span className="error-message">{errors.collaborator}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="newPermission">New Permission</label>
              <select
                id="newPermission"
                value={customData.newPermission}
                onChange={(e) => setCustomData({ ...customData, newPermission: e.target.value })}
              >
                <option value="Read">Read</option>
                <option value="Write">Write</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Proposal</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="proposal-form">
          <div className="form-group">
            <label htmlFor="proposalType">Proposal Type *</label>
            <select
              id="proposalType"
              value={formData.proposalType}
              onChange={(e) => setFormData({ ...formData, proposalType: e.target.value })}
            >
              <option value="CustomProposal">Custom Proposal</option>
              <option value="PlatformUpgrade">Platform Upgrade</option>
              <option value="TreasurySpend">Treasury Spend</option>
              <option value="RepositoryUpdate">Repository Update</option>
              <option value="GovernanceConfig">Governance Config</option>
              <option value="CollaboratorPromotion">Collaborator Promotion</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter proposal title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your proposal in detail"
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {renderProposalTypeFields()}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="votingDuration">Voting Duration (days)</label>
              <input
                type="number"
                id="votingDuration"
                value={formData.votingDuration}
                onChange={(e) => setFormData({ ...formData, votingDuration: parseInt(e.target.value) })}
                min="1"
                max="30"
              />
            </div>
            <div className="form-group">
              <label htmlFor="executionDelay">Execution Delay (days)</label>
              <input
                type="number"
                id="executionDelay"
                value={formData.executionDelay}
                onChange={(e) => setFormData({ ...formData, executionDelay: parseInt(e.target.value) })}
                min="0"
                max="14"
              />
            </div>
          </div>

          {errors.wallet && <div className="error-message">{errors.wallet}</div>}
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProposalModal 