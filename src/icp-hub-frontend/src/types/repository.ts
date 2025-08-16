// Repository types for the frontend application

export interface Repository {
  id: string
  name: string
  description?: string
  owner: string
  isPrivate: boolean
  stars: number
  forks: number
  language?: string
  updatedAt: number
  supportedChains: string[]
  size: number
}

export interface RepositoryFilters {
  search?: string
  language?: string
  chain?: string
  sort?: string
  visibility?: string
  page?: number
  limit?: number
}

export interface RepositoryListResponse {
  repositories: Repository[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface CreateRepositoryRequest {
  name: string
  description?: string
  isPrivate?: boolean
  supportedChains?: string[]
} 
