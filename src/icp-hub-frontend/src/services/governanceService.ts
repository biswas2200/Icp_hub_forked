// Governance Service for ICP Hub backend integration
// This service handles all governance and DAO-related operations

// @ts-ignore
import apiService from './api.js'

// Governance types matching backend
export interface ProposalId {
  id: number
}

export interface VotingPower {
  amount: number
}

export interface TokenAmount {
  amount: number
}

export type ProposalStatus = 
  | 'Draft'
  | 'Active' 
  | 'Passed'
  | 'Failed'
  | 'Executed'
  | 'Cancelled'
  | 'Expired'

export interface RepositoryUpdateProposal {
  repositoryId: string
  newSettings: any // RepositorySettings type
}

export interface PlatformUpgradeProposal {
  version: string
  description: string
  canisterId?: string
}

export interface TreasurySpendProposal {
  amount: number
  recipient: string
  purpose: string
}

export interface GovernanceConfigProposal {
  newConfig: GovernanceConfig
}

export interface CollaboratorPromotionProposal {
  repositoryId: string
  collaborator: string
  newPermission: string
}

export interface CustomProposal {
  title: string
  description: string
  executionData?: any
}

export type ProposalType = 
  | { type: 'RepositoryUpdate'; data: RepositoryUpdateProposal }
  | { type: 'PlatformUpgrade'; data: PlatformUpgradeProposal }
  | { type: 'TreasurySpend'; data: TreasurySpendProposal }
  | { type: 'GovernanceConfig'; data: GovernanceConfigProposal }
  | { type: 'CollaboratorPromotion'; data: CollaboratorPromotionProposal }
  | { type: 'CustomProposal'; data: CustomProposal }

export type Vote = 'Yes' | 'No' | 'Abstain'

export interface VoteRecord {
  voter: string
  vote: Vote
  votingPower: number
  timestamp: number
  reason?: string
}

export interface DiscussionPost {
  id: number
  author: string
  content: string
  timestamp: number
  parentId?: number
  reactions: Array<{ emoji: string; users: string[] }>
}

export interface Proposal {
  id: number
  proposer: string
  proposalType: ProposalType
  title: string
  description: string
  createdAt: number
  votingStartsAt: number
  votingEndsAt: number
  executionDelay: number
  status: ProposalStatus
  votes: VoteRecord[]
  totalYesVotes: number
  totalNoVotes: number
  totalAbstainVotes: number
  quorumRequired: number
  approvalThreshold: number
  executedAt?: number
  executedBy?: string
  discussionThread: DiscussionPost[]
}

export interface GovernanceConfig {
  votingPeriod: number
  executionDelay: number
  proposalDeposit: number
  quorumPercentage: number
  approvalThreshold: number
  maxProposalsPerUser: number
  minVotingPower: number
  allowDelegation: boolean
}

export interface VotingStats {
  totalSupply: number
  circulatingSupply: number
  totalStaked: number
  activeVoters: number
  participationRate: number
}

export interface GovernanceToken {
  balance: number
  staked: number
  delegatedTo?: string
  delegatedFrom: string[]
  lastActivityAt: number
  reputationScore: number
}

export interface CreateProposalRequest {
  proposalType: ProposalType
  title: string
  description: string
  votingDuration?: number
  executionDelay?: number
}

export interface CastVoteRequest {
  proposalId: number
  vote: Vote
  reason?: string
}

export interface DelegateVoteRequest {
  delegateTo: string
  scope: 'All' | 'Repository' | 'ProposalType'
}

export interface ProposalListRequest {
  status?: ProposalStatus
  proposer?: string
  proposalType?: string
  pagination?: {
    page?: number
    limit?: number
    offset?: number
  }
}

export interface ProposalListResponse {
  proposals: Proposal[]
  totalCount: number
  hasMore: boolean
}

export interface AddDiscussionPostRequest {
  proposalId: number
  content: string
  parentId?: number
}

class GovernanceService {
  // @ts-ignore
  private baseUrl = '/governance'

  // Get all proposals with optional filters
  async getProposals(_filters: ProposalListRequest = {}): Promise<ProposalListResponse> {
    try {
      // TODO: Implement governance methods in backend
      console.log('Using mock governance data - backend integration pending')
      return this.getMockProposals()
    } catch (error) {
      console.error('Error fetching proposals:', error)
      return this.getMockProposals()
    }
  }

  // Get a specific proposal by ID
  async getProposal(id: number): Promise<Proposal> {
    try {
      // TODO: Implement in backend
      const mockProposals = this.getMockProposals()
      const proposal = mockProposals.proposals.find(p => p.id === id)
      if (!proposal) {
        throw new Error(`Proposal with id ${id} not found`)
      }
      return proposal
    } catch (error) {
      console.error('Error fetching proposal:', error)
      throw error
    }
  }

  // Create a new proposal
  async createProposal(proposalData: CreateProposalRequest): Promise<Proposal> {
    try {
      // TODO: Implement in backend
      console.log('Creating mock proposal:', proposalData)
      
      // Create mock proposal
      const newProposal: Proposal = {
        id: Date.now(),
        proposer: 'current-user.icp',
        proposalType: proposalData.proposalType,
        title: proposalData.title,
        description: proposalData.description,
        createdAt: Date.now(),
        votingStartsAt: Date.now() + (24 * 60 * 60 * 1000), // 1 day from now
        votingEndsAt: Date.now() + (8 * 24 * 60 * 60 * 1000), // 8 days from now
        executionDelay: proposalData.executionDelay || (2 * 24 * 60 * 60 * 1000),
        status: 'Draft',
        votes: [],
        totalYesVotes: 0,
        totalNoVotes: 0,
        totalAbstainVotes: 0,
        quorumRequired: 5000,
        approvalThreshold: 60.0,
        discussionThread: []
      }
      
      return newProposal
    } catch (error) {
      console.error('Error creating proposal:', error)
      throw error
    }
  }

  // Cast a vote on a proposal
  async castVote(voteData: CastVoteRequest): Promise<void> {
    try {
      // TODO: Implement in backend
      console.log('Casting mock vote:', voteData)
    } catch (error) {
      console.error('Error casting vote:', error)
      throw error
    }
  }

  // Execute a passed proposal
  async executeProposal(proposalId: number): Promise<void> {
    try {
      // TODO: Implement in backend
      console.log('Executing mock proposal:', proposalId)
    } catch (error) {
      console.error('Error executing proposal:', error)
      throw error
    }
  }

  // Cancel a proposal
  async cancelProposal(proposalId: number): Promise<void> {
    try {
      // TODO: Implement in backend
      console.log('Cancelling mock proposal:', proposalId)
    } catch (error) {
      console.error('Error cancelling proposal:', error)
      throw error
    }
  }

  // Get governance configuration
  async getGovernanceConfig(): Promise<GovernanceConfig> {
    try {
      // TODO: Implement in backend
      return {
        votingPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        executionDelay: 2 * 24 * 60 * 60 * 1000, // 2 days
        proposalDeposit: 100,
        quorumPercentage: 10.0,
        approvalThreshold: 60.0,
        maxProposalsPerUser: 5,
        minVotingPower: 100,
        allowDelegation: true
      }
    } catch (error) {
      console.error('Error fetching governance config:', error)
      throw error
    }
  }

  // Get voting statistics
  async getVotingStats(): Promise<VotingStats> {
    try {
      // TODO: Implement in backend
      return {
        totalSupply: 1000000,
        circulatingSupply: 750000,
        totalStaked: 500000,
        activeVoters: 1250,
        participationRate: 75.5
      }
    } catch (error) {
      console.error('Error fetching voting stats:', error)
      throw error
    }
  }

  // Get user's governance token info
  async getUserTokenInfo(userId: string): Promise<GovernanceToken> {
    try {
      // TODO: Implement in backend
      console.log('Getting mock user token info for:', userId)
      return {
        balance: 10000,
        staked: 5000,
        delegatedFrom: [],
        lastActivityAt: Date.now(),
        reputationScore: 85
      }
    } catch (error) {
      console.error('Error fetching user token info:', error)
      throw error
    }
  }

  // Delegate voting power
  async delegateVote(delegationData: DelegateVoteRequest): Promise<void> {
    try {
      // TODO: Implement in backend
      console.log('Delegating mock vote:', delegationData)
    } catch (error) {
      console.error('Error delegating vote:', error)
      throw error
    }
  }

  // Add discussion post to a proposal
  async addDiscussionPost(postData: AddDiscussionPostRequest): Promise<DiscussionPost> {
    try {
      // TODO: Implement in backend
      console.log('Adding mock discussion post:', postData)
      
      const newPost: DiscussionPost = {
        id: Date.now(),
        author: 'current-user.icp',
        content: postData.content,
        timestamp: Date.now(),
        parentId: postData.parentId,
        reactions: []
      }
      
      return newPost
    } catch (error) {
      console.error('Error adding discussion post:', error)
      throw error
    }
  }

  // Get discussion posts for a proposal
  async getDiscussionPosts(proposalId: number): Promise<DiscussionPost[]> {
    try {
      // TODO: Implement in backend
      console.log('Getting mock discussion posts for proposal:', proposalId)
      return []
    } catch (error) {
      console.error('Error fetching discussion posts:', error)
      return []
    }
  }


  // Mock data for development
  private getMockProposals(): ProposalListResponse {
    const mockProposals: Proposal[] = [
      {
        id: 1,
        proposer: 'alice.icp',
        proposalType: { type: 'PlatformUpgrade', data: { version: '2.0.0', description: 'Major platform upgrade with new features' } },
        title: 'Platform Upgrade to v2.0.0',
        description: 'This proposal seeks to upgrade the OpenKeyHub platform to version 2.0.0, introducing new features including enhanced governance tools, improved UI/UX, and better performance.',
        createdAt: Date.now() - 86400000 * 3, // 3 days ago
        votingStartsAt: Date.now() - 86400000 * 2, // 2 days ago
        votingEndsAt: Date.now() + 86400000 * 4, // 4 days from now
        executionDelay: 2 * 24 * 60 * 60 * 1000,
        status: 'Active',
        votes: [
          { voter: 'alice.icp', vote: 'Yes', votingPower: 5000, timestamp: Date.now() - 86400000, reason: 'Great improvements!' },
          { voter: 'bob.icp', vote: 'Yes', votingPower: 3000, timestamp: Date.now() - 43200000, reason: 'Looking forward to new features' },
          { voter: 'charlie.icp', vote: 'No', votingPower: 2000, timestamp: Date.now() - 21600000, reason: 'Need more testing' }
        ],
        totalYesVotes: 8000,
        totalNoVotes: 2000,
        totalAbstainVotes: 0,
        quorumRequired: 5000,
        approvalThreshold: 60.0,
        discussionThread: [
          { id: 1, author: 'alice.icp', content: 'This upgrade will bring significant improvements to the platform.', timestamp: Date.now() - 86400000 * 3, reactions: [{ emoji: '👍', users: ['bob.icp', 'diana.icp'] }] },
          { id: 2, author: 'bob.icp', content: 'What are the specific new features?', timestamp: Date.now() - 86400000 * 2, parentId: 1, reactions: [{ emoji: '🤔', users: ['charlie.icp'] }] }
        ]
      },
      {
        id: 2,
        proposer: 'diana.icp',
        proposalType: { type: 'TreasurySpend', data: { amount: 10000, recipient: 'marketing.icp', purpose: 'Marketing campaign for platform adoption' } },
        title: 'Marketing Campaign Funding',
        description: 'Allocate 10,000 tokens from the treasury for a comprehensive marketing campaign to increase platform adoption and user engagement.',
        createdAt: Date.now() - 86400000 * 7, // 7 days ago
        votingStartsAt: Date.now() - 86400000 * 6, // 6 days ago
        votingEndsAt: Date.now() - 86400000 * 1, // 1 day ago
        executionDelay: 2 * 24 * 60 * 60 * 1000,
        status: 'Passed',
        votes: [
          { voter: 'alice.icp', vote: 'Yes', votingPower: 5000, timestamp: Date.now() - 86400000 * 5 },
          { voter: 'bob.icp', vote: 'Yes', votingPower: 3000, timestamp: Date.now() - 86400000 * 4 },
          { voter: 'charlie.icp', vote: 'Yes', votingPower: 2000, timestamp: Date.now() - 86400000 * 3 },
          { voter: 'diana.icp', vote: 'Yes', votingPower: 4000, timestamp: Date.now() - 86400000 * 2 }
        ],
        totalYesVotes: 14000,
        totalNoVotes: 0,
        totalAbstainVotes: 0,
        quorumRequired: 5000,
        approvalThreshold: 60.0,
        executedAt: Date.now() - 86400000,
        executedBy: 'diana.icp',
        discussionThread: []
      },
      {
        id: 3,
        proposer: 'charlie.icp',
        proposalType: { type: 'RepositoryUpdate', data: { repositoryId: 'cross-chain-defi', newSettings: {} } },
        title: 'Update Repository Settings',
        description: 'Update the settings for the cross-chain-defi repository to enable new collaboration features.',
        createdAt: Date.now() - 86400000 * 10, // 10 days ago
        votingStartsAt: Date.now() - 86400000 * 9, // 9 days ago
        votingEndsAt: Date.now() - 86400000 * 4, // 4 days ago
        executionDelay: 2 * 24 * 60 * 60 * 1000,
        status: 'Failed',
        votes: [
          { voter: 'alice.icp', vote: 'No', votingPower: 5000, timestamp: Date.now() - 86400000 * 8 },
          { voter: 'bob.icp', vote: 'No', votingPower: 3000, timestamp: Date.now() - 86400000 * 7 },
          { voter: 'charlie.icp', vote: 'Yes', votingPower: 2000, timestamp: Date.now() - 86400000 * 6 }
        ],
        totalYesVotes: 2000,
        totalNoVotes: 8000,
        totalAbstainVotes: 0,
        quorumRequired: 5000,
        approvalThreshold: 60.0,
        discussionThread: []
      }
    ]

    return {
      proposals: mockProposals,
      totalCount: mockProposals.length,
      hasMore: false
    }
  }
}

// Export singleton instance
export const governanceService = new GovernanceService()
export default governanceService
