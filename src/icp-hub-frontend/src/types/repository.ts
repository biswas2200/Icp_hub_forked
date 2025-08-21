// Update your src/types/repository.ts file with these complete types:

export interface Repository {
  id: string
  name: string
  description?: string
  owner: string
  isPrivate: boolean
  visibility?: 'public' | 'private'  
  stars: number
  forks: number
  watchers: number
  issues: number
  language?: string
  license?: string
  createdAt: string | number
  updatedAt: string | number
  supportedChains?: string[]
  chains?: string[]  // Alternative name for chains
  size: number
  cloneUrl?: string  // Add for git operations
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
  visibility?: 'public' | 'private'  // Alternative to isPrivate
  supportedChains?: string[]
  chains?: string[]  // Alternative name
  language?: string
  license?: string
  projectType?: 'DeFi' | 'NFT' | 'DAO' | 'Gaming' | 'Infrastructure' | 'CrossChain' | 'Other'
  autoDeployEnabled?: boolean
}

// Add file-related types for the file explorer
export interface FileEntry {
  path: string
  name: string
  content: Uint8Array | number[]
  size: number
  hash: string
  version: number
  lastModified: number | string
  author: string
  commitMessage?: string
  isFolder: boolean
  mimeType?: string
  parentPath?: string
  fileType?: string
  contractMetadata?: any
  targetChain?: string
}

export interface FileNode {
  path: string
  name: string
  isFolder: boolean
  size: number
  lastModified: string | number
  children?: FileNode[]
}

export interface FileTreeResponse {
  repositoryId: string
  tree: FileNode[]
  totalFiles: number
  totalFolders: number
  totalSize: number
}

export interface CreateFolderRequest {
  repositoryId: string
  folderPath: string
  folderName: string
}

export interface UploadFileRequest {
  repositoryId: string
  path: string
  content: number[]
  commitMessage: string
  branch?: string
}
