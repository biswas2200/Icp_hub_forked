import { apiService } from './apiService.ts'

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
}

class RepositoryService {
  private baseUrl = '/repositories'
  private isBackendAvailable = true

  async getRepositories(filters: RepositoryFilters = {}): Promise<RepositoryListResponse> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend not available')
      }

      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })

      const response = await apiService.get(`${this.baseUrl}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock data:', error)
      this.isBackendAvailable = false
      return this.getMockRepositories()
    }
  }

  async getRepository(id: string): Promise<Repository> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend not available')
      }

      const response = await apiService.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock data:', error)
      this.isBackendAvailable = false
      return this.getMockRepository(id)
    }
  }

  async createRepository(repositoryData: CreateRepositoryRequest): Promise<Repository> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend not available')
      }

      const response = await apiService.post(this.baseUrl, repositoryData)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock data:', error)
      this.isBackendAvailable = false
      return this.createMockRepository(repositoryData)
    }
  }

  async updateRepository(id: string, repositoryData: Partial<CreateRepositoryRequest>): Promise<Repository> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend not available')
      }

      const response = await apiService.put(`${this.baseUrl}/${id}`, repositoryData)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock data:', error)
      this.isBackendAvailable = false
      return this.updateMockRepository(id, repositoryData)
    }
  }

  async deleteRepository(id: string): Promise<void> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend not available')
      }

      await apiService.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.warn('Backend not available, using mock data:', error)
      this.isBackendAvailable = false
      // Mock deletion - in real implementation, you might want to update local state
    }
  }

  private getMockRepositories(): RepositoryListResponse {
    const mockRepositories: Repository[] = [
      {
        id: '1',
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
      {
        id: '2',
        name: 'multichain-nft-marketplace',
        description: 'Cross-chain NFT marketplace supporting multiple blockchain networks with zero gas fees',
        owner: 'bob.icp',
        visibility: 'public',
        stars: 1876,
        forks: 324,
        watchers: 987,
        issues: 67,
        language: 'TypeScript',
        license: 'Apache-2.0',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-19T16:20:00Z',
        chains: ['Ethereum', 'BSC', 'Avalanche'],
        cloneUrl: 'https://github.com/bob/multichain-nft-marketplace.git'
      },
      {
        id: '3',
        name: 'dao-governance-platform',
        description: 'Decentralized governance platform built on Internet Computer with advanced voting mechanisms',
        owner: 'charlie.icp',
        visibility: 'public',
        stars: 1234,
        forks: 289,
        watchers: 567,
        issues: 45,
        language: 'Motoko',
        license: 'GPL-3.0',
        createdAt: '2024-01-05T11:00:00Z',
        updatedAt: '2024-01-18T13:30:00Z',
        chains: ['Internet Computer'],
        cloneUrl: 'https://github.com/charlie/dao-governance-platform.git'
      },
      {
        id: '4',
        name: 'yield-farming-protocol',
        description: 'Optimized yield farming protocol with automated compounding strategies',
        owner: 'diana.icp',
        visibility: 'private',
        stars: 987,
        forks: 156,
        watchers: 234,
        issues: 23,
        language: 'Solidity',
        license: 'MIT',
        createdAt: '2024-01-12T08:45:00Z',
        updatedAt: '2024-01-17T15:10:00Z',
        chains: ['Ethereum', 'Polygon'],
        cloneUrl: 'https://github.com/diana/yield-farming-protocol.git'
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
    const repository = mockRepositories.find(repo => repo.id === id)
    
    if (!repository) {
      throw new Error(`Repository with id ${id} not found`)
    }
    
    return repository
  }

  private createMockRepository(repositoryData: CreateRepositoryRequest): Repository {
    const newRepository: Repository = {
      id: Date.now().toString(),
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

export const repositoryService = new RepositoryService()
export default repositoryService 