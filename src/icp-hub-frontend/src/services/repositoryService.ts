import apiService, { type SerializableRepository } from './api.js';

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
  
  static normalize(id: string | undefined | null): string {
    if (!id) {
      throw new Error('Repository ID is required')
    }
    
    if (id.startsWith(this.ID_PREFIX)) {
      return id
    }
    
    const numericMatch = id.match(/\d+$/)
    if (numericMatch) {
      return `${this.ID_PREFIX}${numericMatch[0]}`
    }
    
    return `${this.ID_PREFIX}${id}`
  }
  
  static extractNumeric(id: string): string {
    return id.replace(this.ID_PREFIX, '')
  }
  
  static isValid(id: string): boolean {
    return id.startsWith(this.ID_PREFIX) && /^repo_\w+$/.test(id)
  }
}

class RepositoryService {
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
      return [{ ICP: null }]
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

  private mapProjectType(projectType?: string): any {
    if (!projectType) return { DeFi: null }

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
      // Initialize API service (will create anonymous actor if not authenticated)
      if (!apiService.actor) {
        console.log('Initializing API service...')
        await apiService.init()
      }
      
      console.log('Authentication status:', {
        isAuthenticated: apiService.isAuthenticated,
        hasActor: !!apiService.actor,
        currentUser: !!apiService.currentUser
      })
      
      // Always try to fetch from backend, regardless of authentication status
      if (apiService.actor) {
        // For authenticated users, fetch their repositories
        if (apiService.isAuthenticated) {
          try {
            // Load current user if not already loaded
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
              
              if (result.success && result.data) {
                console.log('✅ Successfully fetched user repositories from backend:', result.data.totalCount)
                
                // Transform user's repositories
                const userRepositories: Repository[] = result.data.repositories.map((repo: any) => ({
                  id: repo.id,
                  name: repo.name,
                  description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
                  owner: repo.owner.toString(),
                  visibility: (repo.isPrivate ? 'private' : 'public') as 'public' | 'private',
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
                
                // Also fetch public repositories
                console.log('Fetching public repositories...')
                const publicResult = await apiService.listPublicRepositories({
                  page: 0,
                  limit: 100
                })
                
                if (publicResult.success && publicResult.data && apiService.currentUser) {
                  const currentUserPrincipal = apiService.currentUser.principal.toString()
                  const publicRepositories: Repository[] = publicResult.data.repositories
                    .filter((repo: SerializableRepository) => repo.owner.toString() !== currentUserPrincipal)
                    .map((repo: any) => ({
                      id: repo.id,
                      name: repo.name,
                      description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
                      owner: repo.owner.toString(),
                      visibility: 'public' as 'public' | 'private',
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
                  
                  // Combine user's repositories with other public repositories
                  const allRepositories = [...userRepositories, ...publicRepositories]
                  
                  return {
                    repositories: allRepositories,
                    total: allRepositories.length,
                    page: 1,
                    limit: 100
                  }
                } else {
                  // If public fetch fails, return just user's repositories
                  return {
                    repositories: userRepositories,
                    total: userRepositories.length,
                    page: 1,
                    limit: 100
                  }
                }
              }
            } else {
              console.log('User not registered yet, showing only public repositories')
            }
          } catch (error) {
            console.log('Error fetching user repositories, falling back to public only:', error)
          }
        }
        
        // For anonymous users or when user fetch fails, fetch all public repositories
        console.log('Fetching public repositories as anonymous user...')
        
        const result = await apiService.listPublicRepositories({
          page: 0,
          limit: 100
        })
        
        if (result.success && result.data) {
          console.log('✅ Successfully fetched public repositories:', result.data.totalCount)
          
          const repositories: Repository[] = result.data.repositories.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
            owner: repo.owner.toString(),
            visibility: 'public' as 'public' | 'private',
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
          console.warn('Failed to fetch public repositories:', result.error)
          throw new Error('Failed to fetch public repositories')
        }
      }
      
      throw new Error('No actor available - backend connection failed')
    } catch (error) {
      console.warn('Backend not available, using mock data:', this.getErrorMessage(error))
      return this.getMockRepositories()
    }
  }

  async getRepository(id: string): Promise<Repository> {
    try {
      if (!apiService.actor) {
        await apiService.init()
      }

      const normalizedId = RepositoryIdManager.normalize(id)
      
      console.log('Original ID:', id)
      console.log('Normalized ID:', normalizedId)
      console.log('Fetching repository with normalized ID:', normalizedId)
      
      const result = await apiService.getRepository(normalizedId)
      
      if (result.success && result.data) {
        const repo = result.data
        console.log('Raw repository data:', repo)
        
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
          owner: repo.owner.toString(),
          visibility: (repo.isPrivate ? 'private' : 'public') as 'public' | 'private',
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
        throw new Error(apiService.getErrorMessage(result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Get repository error:', this.getErrorMessage(error))
      
      if (this.getErrorMessage(error).includes('not found') && !RepositoryIdManager.isValid(id)) {
        throw new Error(`Repository not found. Invalid ID format: ${id}. Expected format: repo_<id>`)
      }
      
      throw error
    }
  }

  async createRepository(repositoryData: CreateRepositoryRequest): Promise<Repository> {
    try {
      if (!apiService.actor) {
        await apiService.init()
      }

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
      
      if (result.success && result.data) {
        const repo = result.data
        console.log('Backend response:', repo)
        console.log('Created repository with ID:', repo.id)
        
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
          owner: repo.owner.toString(),
          visibility: (repo.isPrivate ? 'private' : 'public') as 'public' | 'private',
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
        throw new Error(apiService.getErrorMessage(result.error || 'Failed to create repository'))
      }
    } catch (error) {
      console.error('Backend not available, using mock data:', this.getErrorMessage(error))
      return this.createMockRepository(repositoryData)
    }
  }

  async updateRepository(id: string, repositoryData: Partial<CreateRepositoryRequest>): Promise<Repository> {
    try {
      if (!apiService.actor) {
        await apiService.init()
      }

      const normalizedId = RepositoryIdManager.normalize(id)

      const backendUpdate = {
        description: repositoryData.description ? [repositoryData.description] : [],
        settings: undefined 
      }

      const result = await apiService.updateRepository(normalizedId, backendUpdate)
      
      if (result.success && result.data) {
        const repo = result.data
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description && repo.description.length > 0 ? repo.description[0] : undefined,
          owner: repo.owner.toString(),
          visibility: (repo.isPrivate ? 'private' : 'public') as 'public' | 'private',
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
      if (!apiService.actor) {
        await apiService.init()
      }

      const normalizedId = RepositoryIdManager.normalize(id)

      const result = await apiService.deleteRepository(normalizedId)
      
      if (!result.success) {
        throw new Error('Failed to delete repository')
      }
    } catch (error) {
      console.warn('Backend not available, using mock operation:', this.getErrorMessage(error))
    }
  }

  async debugListAllRepositories(): Promise<any> {
    try {
      console.log('=== Repository Debug Information ===')
      
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
      
      if (result.success && result.data) {
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
      
      console.log('🔍 Diagnostic information:')
      console.log('- API Service authenticated:', apiService.isAuthenticated)
      console.log('- API Service has actor:', !!apiService.actor)
      console.log('- API Service current user:', !!apiService.currentUser)
      
      if (apiService.isAuthenticated && apiService.getPrincipal) {
        console.log('- Principal:', apiService.getPrincipal()?.toString())
      }
      
      throw error
    }
  }

  private getMockRepositories(): RepositoryListResponse {
    const mockRepositories: Repository[] = [
      {
        id: 'repo_1',
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
      }
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
    const normalizedId = RepositoryIdManager.normalize(id)
    const repository = mockRepositories.find(repo => repo.id === normalizedId)
    
    if (!repository) {
      throw new Error(`Repository with id ${normalizedId} not found`)
    }
    
    return repository
  }

  private createMockRepository(repositoryData: CreateRepositoryRequest): Repository {
    const newRepository: Repository = {
      id: `repo_${Date.now()}`,
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