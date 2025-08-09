import { useState, useEffect } from 'react'
import { governanceService } from '../services/governanceService'
import type { Proposal, ProposalStatus, Vote, VotingStats } from '../services/governanceService'
import { useWallet } from '../services/walletService'
import CreateProposalModal from './CreateProposalModal'
import PageLayout from './PageLayout'
import './Governance.css'

function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [votingStats, setVotingStats] = useState<VotingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{
    status: ProposalStatus | 'all'
    type: string
  }>({
    status: 'all',
    type: 'all'
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { wallet } = useWallet()

  useEffect(() => {
    fetchGovernanceData()
  }, [filters])

  const fetchGovernanceData = async () => {
    try {
      setLoading(true)
      
      const [proposalsResponse, statsResponse] = await Promise.all([
        governanceService.getProposals({
          status: filters.status === 'all' ? undefined : filters.status,
          proposalType: filters.type === 'all' ? undefined : filters.type
        }),
        governanceService.getVotingStats()
      ])

      setProposals(proposalsResponse.proposals)
      setVotingStats(statsResponse)
      setError(null)
    } catch (err) {
      setError('Failed to fetch governance data')
      console.error('Error fetching governance data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (proposalId: number, vote: Vote, reason?: string) => {
    if (!wallet.connected) {
      setError('Please connect your wallet to vote')
      return
    }

    try {
      await governanceService.castVote({
        proposalId,
        vote,
        reason
      })
      
      // Refresh proposals to show updated vote
      await fetchGovernanceData()
    } catch (err) {
      setError('Failed to cast vote')
      console.error('Error casting vote:', err)
    }
  }

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case 'Active': return '#3b82f6'
      case 'Passed': return '#10b981'
      case 'Failed': return '#ef4444'
      case 'Executed': return '#059669'
      case 'Cancelled': return '#6b7280'
      case 'Expired': return '#f59e0b'
      case 'Draft': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const getProposalTypeIcon = (type: string) => {
    switch (type) {
      case 'PlatformUpgrade': return '🚀'
      case 'TreasurySpend': return '💰'
      case 'RepositoryUpdate': return '📁'
      case 'GovernanceConfig': return '⚙️'
      case 'CollaboratorPromotion': return '👥'
      case 'CustomProposal': return '📝'
      default: return '📋'
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getVotePercentage = (proposal: Proposal, voteType: Vote) => {
    const totalVotes = proposal.totalYesVotes + proposal.totalNoVotes + proposal.totalAbstainVotes
    if (totalVotes === 0) return 0

    let voteCount = 0
    switch (voteType) {
      case 'Yes': voteCount = proposal.totalYesVotes; break
      case 'No': voteCount = proposal.totalNoVotes; break
      case 'Abstain': voteCount = proposal.totalAbstainVotes; break
    }

    return Math.round((voteCount / totalVotes) * 100)
  }

  const getQuorumStatus = (proposal: Proposal) => {
    const totalVotes = proposal.totalYesVotes + proposal.totalNoVotes + proposal.totalAbstainVotes
    const quorumPercentage = (totalVotes / proposal.quorumRequired) * 100
    return Math.min(quorumPercentage, 100)
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="governance-loading">
          <div className="loading-spinner"></div>
          <p>Loading governance data...</p>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="governance-error">
          <h3>Error loading governance</h3>
          <p>{error}</p>
          <button onClick={fetchGovernanceData} className="retry-btn">
            Try again
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="governance-page">
      {/* Header */}
      <div className="governance-header">
        <div className="header-content">
          <h1>Governance & DAO</h1>
          <p>Participate in platform governance through proposals and voting</p>
        </div>
      </div>

      {/* Stats Overview */}
      {votingStats && (
        <div className="governance-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Supply</h3>
              <p>{votingStats.totalSupply.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Circulating</h3>
              <p>{votingStats.circulatingSupply.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Total Staked</h3>
              <p>{votingStats.totalStaked.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Active Voters</h3>
              <p>{votingStats.activeVoters.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Participation Rate</h3>
              <p>{votingStats.participationRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="governance-filters">
        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as ProposalStatus | 'all' })}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Executed">Executed</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="PlatformUpgrade">Platform Upgrade</option>
            <option value="TreasurySpend">Treasury Spend</option>
            <option value="RepositoryUpdate">Repository Update</option>
            <option value="GovernanceConfig">Governance Config</option>
            <option value="CollaboratorPromotion">Collaborator Promotion</option>
            <option value="CustomProposal">Custom Proposal</option>
          </select>
        </div>
        
        {wallet.connected && (
          <button 
            className="create-proposal-btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Proposal
          </button>
        )}
      </div>

      {/* Proposals List */}
      <div className="governance-content">
        {proposals.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <h3>No proposals found</h3>
            <p>Try adjusting your filters or create a new proposal</p>
          </div>
        ) : (
          <div className="proposals-list">
            {proposals.map(proposal => (
              <div key={proposal.id} className="proposal-card">
                <div className="proposal-header">
                  <div className="proposal-meta">
                    <span className="proposal-type-icon">
                      {getProposalTypeIcon(proposal.proposalType.type)}
                    </span>
                    <span className="proposal-type">{proposal.proposalType.type}</span>
                    <span 
                      className="proposal-status"
                      style={{ backgroundColor: getStatusColor(proposal.status) }}
                    >
                      {proposal.status}
                    </span>
                  </div>
                  <div className="proposal-id">#{proposal.id}</div>
                </div>

                <div className="proposal-content">
                  <h3 className="proposal-title">{proposal.title}</h3>
                  <p className="proposal-description">{proposal.description}</p>
                  
                  <div className="proposal-details">
                    <div className="proposal-info">
                      <span>Proposed by {proposal.proposer}</span>
                      <span>Created {formatDate(proposal.createdAt)}</span>
                      {proposal.status === 'Active' && (
                        <span>Ends {formatDate(proposal.votingEndsAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Voting Progress */}
                <div className="voting-progress">
                  <div className="quorum-indicator">
                    <div className="quorum-bar">
                      <div 
                        className="quorum-fill"
                        style={{ width: `${getQuorumStatus(proposal)}%` }}
                      ></div>
                    </div>
                    <span>Quorum: {getQuorumStatus(proposal).toFixed(1)}%</span>
                  </div>

                  <div className="vote-breakdown">
                    <div className="vote-bar">
                      <div 
                        className="vote-fill yes"
                        style={{ width: `${getVotePercentage(proposal, 'Yes')}%` }}
                      ></div>
                      <div 
                        className="vote-fill no"
                        style={{ width: `${getVotePercentage(proposal, 'No')}%` }}
                      ></div>
                      <div 
                        className="vote-fill abstain"
                        style={{ width: `${getVotePercentage(proposal, 'Abstain')}%` }}
                      ></div>
                    </div>
                    <div className="vote-labels">
                      <span>Yes: {getVotePercentage(proposal, 'Yes')}%</span>
                      <span>No: {getVotePercentage(proposal, 'No')}%</span>
                      <span>Abstain: {getVotePercentage(proposal, 'Abstain')}%</span>
                    </div>
                  </div>
                </div>

                {/* Voting Actions */}
                {proposal.status === 'Active' && wallet.connected && (
                  <div className="voting-actions">
                    <button 
                      className="vote-btn yes"
                      onClick={() => handleVote(proposal.id, 'Yes')}
                    >
                      Vote Yes
                    </button>
                    <button 
                      className="vote-btn no"
                      onClick={() => handleVote(proposal.id, 'No')}
                    >
                      Vote No
                    </button>
                    <button 
                      className="vote-btn abstain"
                      onClick={() => handleVote(proposal.id, 'Abstain')}
                    >
                      Abstain
                    </button>
                  </div>
                )}

                {/* Discussion Preview */}
                {proposal.discussionThread.length > 0 && (
                  <div className="discussion-preview">
                    <span>{proposal.discussionThread.length} comments</span>
                    <span>Latest: {formatDate(proposal.discussionThread[0].timestamp)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Proposal Modal */}
      <CreateProposalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProposalCreated={(newProposal) => {
          setProposals([newProposal, ...proposals])
          setShowCreateModal(false)
        }}
      />
      </div>
    </PageLayout>
  )
}

export default Governance 