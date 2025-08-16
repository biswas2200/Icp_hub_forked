import apiService from './api.js'

export interface Repository {
  id: string
  name: string
  description?: string
  owner: string
  visibility: 'public' | 'private'
  stars: number
  forks: number
  watchers: number
  issues: number
  language?: string
  license?: string
  createdAt: string
  updatedAt: string
  chains?: string[]
  cloneUrl?: string
}

export interface RepositoryFilters {
  search?: string
  language?: string
  chain?: string
  sort?: 'updated' | 'stars' | 'forks' | 'name'
  visibility?: 'public' | 'private'
}

export interface RepositoryListResponse {
  repositories: Repository[]
  total: number
  page: number
  limit: number
}

export interface CreateRepositoryRequest {
  name: string
  description?: string
  visibility: 'public' | 'private'
  chains?: string[]
  language?: string
  license?: string
  projectType?: 'DeFi' | 'NFT' | 'DAO' | 'Gaming' | 'Infrastructure' | 'CrossChain' | 'Other'
  autoDeployEnabled?: boolean
}

/**
 * Repository ID Management Utility
 * Ensures consistent ID format across the application
 */
class RepositoryIdManager {
  private static readonly ID_PREFIX = 'repo_'
  
  /**
   * Normalizes repository ID to ensure it has the correct format
   * @param id - The repository ID (with or without prefix)
   * @returns Normalized ID with 'repo_' prefix
   */
  static normalize(id: string | undefined | null): string {
    if (!id) {
      throw new Error('Repository ID is required')
    }
    
    // If ID already has the correct prefix, return as-is
    if (id.startsWith(this.ID_PREFIX)) {
      return id
    }
    
    // If ID looks like it might be from a URL or has other prefixes, extract the numeric part
    const numericMatch = id.match(/\d+$/)
    if (numericMatch) {
      return `${this.ID_PREFIX}${numericMatch[0]}`
    }
    
    // Otherwise, assume the entire string is the ID part
    return `${this.ID_PREFIX}${id}`
  }
  
  /**
   * Extracts the numeric part from a repository ID
   * @param id - The full repository ID
   * @returns The numeric portion of the ID
   */
  static extractNumeric(id: string): string {
    return id.replace(this.ID_PREFIX, '')
  }
  
  /**
   * Validates if an ID has the correct format
   * @param id - The repository ID to validate
   * @returns True if the ID has the correct format
   */
  static isValid(id: string): boolean {
    return id.startsWith(this.ID_PREFIX) && /^repo_\w+$/.test(id)
  }
}

class RepositoryService {
  // Helper function to safely extract error message
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message)
    }
    return 'Unknown error occurred'
  }

  private mapChainsToBlockchainTypes(chains?: string[]): any[] {
    if (!chains || chains.length === 0) {
      return [{ ICP: null }] // Default to ICP
    }

    return chains.map(chain => {
      switch (chain.toLowerCase()) {
        case 'ethereum': return { Ethereum: null }
        case 'solana': return { Solana: null }
        case 'bitcoin': return { Bitcoin: null }
        case 'polygon': return { Polygon: null }
        case 'arbitrum': return { Arbitrum: null }
        case 'binance smart chain':
        case 'bsc': return { BinanceSmartChain: null }
        case 'avalanche': return { Avalanche: null }
        case 'near': return { Near: null }
        case 'cosmos': return { Cosmos: null }
        case 'polkadot': return { Polkadot: null }
        case 'icp':
        case 'internet computer':
        default: return { ICP: null }
      }
    })
  }

  // Helper function to map project type to backend format
  private mapProjectType(projectType?: string): any {
    if (!projectType) return { DeFi: null } // Default

    switch (projectType.toLowerCase()) {
      case 'nft': return { NFT: null }
      case 'dao': return { DAO: null }
      case 'gaming': return { Gaming: null }
      case 'infrastructure': return { Infrastructure: null }
      case 'crosschain':
      case 'cross-chain': return { CrossChain: null }
      case 'defi':
      default: return { DeFi: null }
    }
  }

  async getRepositories(_filters: RepositoryFilters = {}): Promise<RepositoryListResponse> {
    try {
      // Initialize API service
      if (!apiService.actor) {
        console.log('Initializing API service...')
        await apiService.init()
      }
      
      // Check authentication status
      console.log('Authentication status:', {
        isAuthenticated: apiService.isAuthenticated,
        hasActor: !!apiService.actor,
        currentUser: !!apiService.currentUser
      })
      
      // Try to get repositories from backend
      if (apiService.isAuthenticated && apiService.actor) {
        // Get current user if not already loaded
        if (!apiService.currentUser) {
          console.log('Loading current user...')
          apiService.currentUser = await apiService.getCurrentUser()
        }

        if (apiService.currentUser) {
          console.log('Fetching repositories for user:', apiService.currentUser.principal.toString())
          
          const result = await apiService.listRepositories(apiService.currentUser.principal, {
            page: 0,
            limit: 100
          })
          
          if (result.success) {
            console.log('✅ Successfully fetched repositories from backend:', result.data.totalCount)
            
            // Transform backend response - ENSURE ID IS PRESERVED CORRECTLY
            const repositories = result.data.repositories.map((repo: any) => ({
              id: repo.id, // Keep the full ID as-is from backend
              name: repo.name,
              description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
              owner: repo.owner.toString(),
              visibility: repo.isPrivate ? 'private' : 'public',
              stars: Number(repo.stars),
              forks: Number(repo.forks),
              watchers: 0,
              issues: 0,
              language: repo.language && repo.language.length > 0 ? repo.language[0] : undefined,
              license: repo.settings && repo.settings.license && repo.settings.license.length > 0 ? repo.settings.license[0] : undefined,
              createdAt: new Date(Number(repo.createdAt) / 1000000).toISOString(),
              updatedAt: new Date(Number(repo.updatedAt) / 1000000).toISOString(),
              chains: []
            }))
            
            return {
              repositories,
              total: Number(result.data.totalCount),
              page: 1,
              limit: 100
            }
          } else {
            console.warn('Backend returned error:', result.error)
            throw new Error('Backend error: ' + JSON.stringify(result.error))
          }
        } else {
          console.log('User not found - this is normal for new users')
          throw new Error('User not registered - please register first')
        }
      }
      
      throw new Error('Not authenticated or no actor available')
    } catch (error) {
      console.warn('Backend not available, using mock data:', this.getErrorMessage(error))
      return this.getMockRepositories()
    }
  }

  async getRepository(id: string): Promise<Repository> {
    try {
      // Initialize API service
      if (!apiService.actor) {
        await apiService.init()
      }

      // Normalize the repository ID to ensure correct format
      const normalizedId = RepositoryIdManager.normalize(id)
      
      console.log('Original ID:', id)
      console.log('Normalized ID:', normalizedId)
      console.log('Fetching repository with normalized ID:', normalizedId)
      
      const result = await apiService.getRepository(normalizedId)
      
      if (result.success) {
        const repo = result.data
        console.log('Raw repository data:', repo)
        
        return {
          id: repo.id, // Keep the full ID from backend
          name: repo.name,
          description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
          owner: repo.owner.toString(),
          visibility: repo.isPrivate ? 'private' : 'public',
          stars: Number(repo.stars),
          forks: Number(repo.forks),
          watchers: 0,
          issues: 0,
          language: repo.language && repo.language.length > 0 ? repo.language[0] : undefined,
          license: repo.settings && repo.settings.license && repo.settings.license.length > 0 ? repo.settings.license[0] : undefined,
          createdAt: new Date(Number(repo.createdAt) / 1000000).toISOString(),
          updatedAt: new Date(Number(repo.updatedAt) / 1000000).toISOString(),
          chains: [],
          cloneUrl: `https://openkeyhub.com/${repo.owner}/${repo.name}.git`
        }
      } else {
        console.error('Backend error:', result.error)
        throw new Error(apiService.getErrorMessage(result.error))
      }
    } catch (error) {
      console.error('Get repository error:', this.getErrorMessage(error))
      
      // If it's a not found error and we have a numeric ID, provide helpful error
      if (this.getErrorMessage(error).includes('not found') && !RepositoryIdManager.isValid(id)) {
        throw new Error(`Repository not found. Invalid ID format: ${id}. Expected format: repo_<id>`)
      }
      
      throw error
    }
  }

  async createRepository(repositoryData: CreateRepositoryRequest): Promise<Repository> {
    try {
      // Initialize API service
      if (!apiService.actor) {
        await apiService.init()
      }

      // Transform frontend request to backend format
      const backendRequest = {
        name: repositoryData.name,
        description: repositoryData.description ? [repositoryData.description] : [],
        isPrivate: repositoryData.visibility === 'private',
        initializeWithReadme: true,
        license: repositoryData.license ? [repositoryData.license] : [],
        gitignoreTemplate: [],
        targetChains: this.mapChainsToBlockchainTypes(repositoryData.chains),
        projectType: this.mapProjectType(repositoryData.projectType),
        autoDeployEnabled: repositoryData.autoDeployEnabled || false
      }

      console.log('Sending to backend:', backendRequest)

      const result = await apiService.createRepository(backendRequest)
      
      if (result.success) {
        const repo = result.data
        console.log('Backend response:', repo)
        console.log('Created repository with ID:', repo.id)
        
        return {
          id: repo.id, // Keep the full ID from backend
          name: repo.name,
          description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
          owner: repo.owner.toString(),
          visibility: repo.isPrivate ? 'private' : 'public',
          stars: Number(repo.stars),
          forks: Number(repo.forks),
          watchers: 0,
          issues: 0,
          language: repo.language && repo.language.length > 0 ? repo.language[0] : undefined,
          license: repo.settings && repo.settings.license && repo.settings.license.length > 0 ? repo.settings.license[0] : undefined,
          createdAt: new Date(Number(repo.createdAt) / 1000000).toISOString(),
          updatedAt: new Date(Number(repo.updatedAt) / 1000000).toISOString(),
          chains: repositoryData.chains || [],
          cloneUrl: `https://openkeyhub.com/${repo.owner}/${repo.name}.git`
        }
      } else {
        throw new Error(apiService.getErrorMessage(result.error))
      }
    } catch (error) {
      console.error('Backend not available, using mock data:', this.getErrorMessage(error))
      return this.createMockRepository(repositoryData)
    }
  }

  async updateRepository(id: string, repositoryData: Partial<CreateRepositoryRequest>): Promise<Repository> {
    try {
      // Initialize API service
      if (!apiService.actor) {
        await apiService.init()
      }

      // Normalize the repository ID
      const normalizedId = RepositoryIdManager.normalize(id)

      // Transform frontend update to backend format
      const backendUpdate = {
        description: repositoryData.description ? [repositoryData.description] : [],
        settings: undefined 
      }

      const result = await apiService.updateRepository(normalizedId, backendUpdate)
      
      if (result.success) {
        const repo = result.data
        return {
          id: repo.id, // Keep the full ID from backend
          name: repo.name,
          description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
          owner: repo.owner.toString(),
          visibility: repo.isPrivate ? 'private' : 'public',
          stars: Number(repo.stars),
          forks: Number(repo.forks),
          watchers: 0,
          issues: 0,
          language: repo.language && repo.language.length > 0 ? repo.language[0] : undefined,
          license: repo.settings && repo.settings.license && repo.settings.license.length > 0 ? repo.settings.license[0] : undefined,
          createdAt: new Date(Number(repo.createdAt) / 1000000).toISOString(),
          updatedAt: new Date(Number(repo.updatedAt) / 1000000).toISOString(),
          chains: repositoryData.chains || [],
          cloneUrl: `https://openkeyhub.com/${repo.owner}/${repo.name}.git`
        }
      } else {
        throw new Error('Failed to update repository')
      }
    } catch (error) {
      console.warn('Backend not available, using mock data:', this.getErrorMessage(error))
      return this.updateMockRepository(id, repositoryData)
    }
  }

  async deleteRepository(id: string): Promise<void> {
    try {
      // Initialize API service
      if (!apiService.actor) {
        await apiService.init()
      }

      // Normalize the repository ID
      const normalizedId = RepositoryIdManager.normalize(id)

      const result = await apiService.deleteRepository(normalizedId)
      
      if (!result.success) {
        throw new Error('Failed to delete repository')
      }
    } catch (error) {
      console.warn('Backend not available, using mock operation:', this.getErrorMessage(error))
      // Mock deletion - in real implementation, you might want to update local state
    }
  }

  // Debug function to check stored repositories
  async debugListAllRepositories(): Promise<void> {
    try {
      console.log('=== Repository Debug Information ===')
      
      // Check API service state
      if (!apiService.actor) {
        console.log('❌ No actor - initializing...')
        await apiService.init()
      }

      if (!apiService.isAuthenticated) {
        console.log('❌ User not authenticated')
        return
      }

      if (!apiService.currentUser) {
        console.log('📥 Loading current user...')
        apiService.currentUser = await apiService.getCurrentUser()
      }

      if (!apiService.currentUser) {
        console.log('❌ User not found - user needs to register first')
        return
      }

      console.log('✅ Current user:', {
        principal: apiService.currentUser.principal.toString(),
        username: apiService.currentUser.username,
        repositories: apiService.currentUser.repositories
      })
      
      console.log('📡 Calling backend listRepositories...')
      const result = await apiService.listRepositories(apiService.currentUser.principal, {
        page: 0,
        limit: 10
      })
      
      if (result.success) {
        console.log('✅ Backend response successful!')
        console.log('📊 Repository count:', result.data.totalCount)
        console.log('📂 Repositories:')
        
        result.data.repositories.forEach((repo: any, index: number) => {
          console.log(`${index + 1}. ${repo.name} (${repo.id})`, {
            description: repo.description,
            owner: repo.owner.toString(),
            isPrivate: repo.isPrivate,
            createdAt: new Date(Number(repo.createdAt) / 1000000).toISOString()
          })
        })

        return result.data
      } else {
        console.log('❌ Backend error:', result.error)
        throw new Error('Backend returned error: ' + JSON.stringify(result.error))
      }
    } catch (error) {
      console.error('❌ Debug list error:', this.getErrorMessage(error))
      
      // Show what we can see
      console.log('🔍 Diagnostic information:')
      console.log('- API Service authenticated:', apiService.isAuthenticated)
      console.log('- API Service has actor:', !!apiService.actor)
      console.log('- API Service current user:', !!apiService.currentUser)
      
      if (apiService.isAuthenticated && apiService.getPrincipal) {
        console.log('- Principal:', apiService.getPrincipal().toString())
      }
      
      throw error
    }
  }

  // Mock data methods remain the same
  private getMockRepositories(): RepositoryListResponse {
    const mockRepositories: Repository[] = [
      {
        id: 'repo_1', // Using consistent ID format in mock data
        name: 'cross-chain-defi',
        description: 'Advanced DeFi protocol with cross-chain yield farming capabilities and automated market making',
        owner: 'alice.icp',
        visibility: 'public',
        stars: 2341,
        forks: 456,
        watchers: 1234,
        issues: 89,
        language: 'Solidity',
        license: 'MIT',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z',
        chains: ['Ethereum', 'Polygon', 'BSC'],
        cloneUrl: 'https://github.com/alice/cross-chain-defi.git'
      },
      // ... other mock repositories with consistent ID format
    ]

    return {
      repositories: mockRepositories,
      total: mockRepositories.length,
      page: 1,
      limit: 50
    }
  }

  private getMockRepository(id: string): Repository {
    const mockRepositories = this.getMockRepositories().repositories
    // Normalize ID for comparison
    const normalizedId = RepositoryIdManager.normalize(id)
    const repository = mockRepositories.find(repo => repo.id === normalizedId)
    
    if (!repository) {
      throw new Error(`Repository with id ${normalizedId} not found`)
    }
    
    return repository
  }

  private createMockRepository(repositoryData: CreateRepositoryRequest): Repository {
    const newRepository: Repository = {
      id: `repo_${Date.now()}`, // Consistent ID format
      name: repositoryData.name,
      description: repositoryData.description,
      owner: 'current-user.icp',
      visibility: repositoryData.visibility,
      stars: 0,
      forks: 0,
      watchers: 0,
      issues: 0,
      language: repositoryData.language,
      license: repositoryData.license,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chains: repositoryData.chains,
      cloneUrl: `https://github.com/current-user/${repositoryData.name}.git`
    }
    
    return newRepository
  }

  private updateMockRepository(id: string, repositoryData: Partial<CreateRepositoryRequest>): Repository {
    const existingRepo = this.getMockRepository(id)
    
    return {
      ...existingRepo,
      ...repositoryData,
      updatedAt: new Date().toISOString()
    }
  }
}

// Export the ID manager for use in other components
export { RepositoryIdManager }

export const repositoryService = new RepositoryService()
export default repositoryService
