import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

// Basic types
export type Result<T, E> = { Ok: T } | { Err: E };

export interface FileTreeNode {
  path: string;
  name: string;
  isFolder: boolean;
  size?: number;
  lastModified?: number;
  children?: FileTreeNode[];
}

export interface FileTreeResponse {
  nodes: FileTreeNode[];
  rootPath: string;
}

// Error type that matches backend
export type Error = {
  NotFound?: string;
  Unauthorized?: string;
  BadRequest?: string;
  InternalError?: string;
  Conflict?: string;
  Forbidden?: string;
};

// User related types
export interface UserProfile {
  displayName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface User {
  principal: Principal;
  username: string;
  email?: string;
  profile: UserProfile;
  repositories: string[];
  createdAt: bigint;
  updatedAt: bigint;
}

// Repository related types
export type RepositoryVisibility = 'Public' | 'Private' | 'Internal';

export interface RepositorySettings {
  defaultBranch: string;
  allowForking: boolean;
  allowIssues: boolean;
  allowWiki: boolean;
  allowProjects: boolean;
  visibility: { [key in RepositoryVisibility]: null };
  license?: string;
  topics: string[];
}

export type BlockchainType = 
  | { ICP: null }
  | { Ethereum: null }
  | { Solana: null }
  | { Bitcoin: null }
  | { Polygon: null }
  | { Arbitrum: null }
  | { BinanceSmartChain: null }
  | { Avalanche: null }
  | { Near: null }
  | { Cosmos: null }
  | { Polkadot: null };

export type ProjectType =
  | { DeFi: null }
  | { NFT: null }
  | { DAO: null }
  | { Gaming: null }
  | { Infrastructure: null }
  | { CrossChain: null }
  | { Other: string };

export interface CollaboratorPermission {
  Read?: null;
  Write?: null;
  Admin?: null;
  Owner?: null;
}

export interface Collaborator {
  principal: Principal;
  permission: CollaboratorPermission;
  addedAt: bigint;
  addedBy: Principal;
}

export interface FileEntry {
  path: string;
  content: number[];
  size: bigint;
  hash: string;
  version: bigint;
  lastModified: bigint;
  author: Principal;
  commitMessage?: string;
}

export interface Commit {
  id: string;
  message: string;
  author: Principal;
  timestamp: bigint;
  parentCommits: string[];
  changedFiles: string[];
  hash: string;
}

export interface Branch {
  name: string;
  commitId: string;
  isDefault: boolean;
  createdAt: bigint;
  createdBy: Principal;
}

export interface SerializableRepository {
  id: string;
  name: string;
  description?: string[];
  owner: Principal;
  collaborators: [Principal, Collaborator][];
  isPrivate: boolean;
  settings: RepositorySettings;
  createdAt: bigint;
  updatedAt: bigint;
  files: [string, FileEntry][];
  commits: Commit[];
  branches: Branch[];
  stars: bigint;
  forks: bigint;
  language?: string[];
  size: bigint;
}

// Request and response types
export interface CreateUserRequest {
  username: string;
  email?: string;
  profile: UserProfile;
}

export interface CreateRepositoryRequest {
  name: string;
  description?: string[];
  isPrivate: boolean;
  initializeWithReadme: boolean;
  license?: string[];
  gitignoreTemplate?: string[];
  targetChains: BlockchainType[];
  projectType: ProjectType;
  autoDeployEnabled: boolean;
}

export interface UpdateRepositoryRequest {
  description?: string[];
  settings?: RepositorySettings;
}

export interface UploadFileRequest {
  repositoryId: string;
  path: string;
  content: number[];
  commitMessage: string;
  branch?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface RepositoryListResponse {
  repositories: SerializableRepository[];
  totalCount: bigint;
  hasMore: boolean;
}

export interface FileListResponse {
  files: FileEntry[];
  totalCount: bigint;
  path: string;
}

export interface SearchScope {
  All?: null;
  Repositories?: null;
  Users?: null;
  Files?: null;
  Code?: null;
}

export interface SearchRequest {
  searchQuery: string;
  scope: SearchScope;
  pagination?: PaginationParams;
}

export interface SearchResults {
  repositories: {
    repository: SerializableRepository;
    score: number;
    matchedFields: string[];
  }[];
  users: {
    user: User;
    score: number;
    matchedFields: string[];
  }[];
  totalCount: bigint;
  hasMore: boolean;
}

export interface RepositoryStats {
  totalRepositories: bigint;
  publicRepositories: bigint;
  totalUsers: bigint;
  totalStars: bigint;
  totalForks: bigint;
}

export interface AuthContext {
  isAuthenticated: boolean;
  principal: Principal;
  method: { InternetIdentity?: null; NFID?: null; Plug?: null };
  permissions: { ViewPublicRepositories?: null; CreateRepository?: null; ManageOwnRepositories?: null }[];
}

// Define the ApiService class interface
export interface ApiService {
  authClient: AuthClient | null;
  actor: any | null;
  isAuthenticated: boolean;
  currentUser: User | null;
  agent: HttpAgent | null;

  // Core methods
  init(): Promise<boolean>;
  setupActor(): Promise<void>;
  setupAnonymousActor(): Promise<void>;
  login(): Promise<boolean>;
  logout(): Promise<boolean>;
  getPrincipal(): Principal | null;
  backendLogin(): Promise<{success: boolean, data?: string, error?: Error}>;
  getAuthContext(): Promise<{success: boolean, data?: AuthContext, error?: Error}>;
  isAuthenticationValid(): Promise<boolean>;
  
  // User methods
  getCurrentUser(): Promise<User | null>;
  registerUser(userData: CreateUserRequest): Promise<{success: boolean, data?: User, error?: Error}>;
  updateUserProfile(profileData: Partial<UserProfile>): Promise<{success: boolean, data?: User, error?: Error}>;
  getUser(principal: Principal | string): Promise<{success: boolean, data?: User, error?: Error}>;
  
  // Repository methods
  createRepository(repoData: CreateRepositoryRequest): Promise<{success: boolean, data?: SerializableRepository, error?: Error}>;
  getRepository(repositoryId: string): Promise<{success: boolean, data?: SerializableRepository, error?: Error}>;
  listRepositories(owner: Principal | string, pagination?: PaginationParams | null): Promise<{success: boolean, data?: RepositoryListResponse, error?: Error}>;
  updateRepository(repositoryId: string, updateData: UpdateRepositoryRequest): Promise<{success: boolean, data?: SerializableRepository, error?: Error}>;
  deleteRepository(repositoryId: string): Promise<{success: boolean, data?: boolean, error?: Error}>;
  
  // File methods
  uploadFile(fileData: UploadFileRequest): Promise<{success: boolean, data?: FileEntry, error?: Error}>;
  getFile(repositoryId: string, path: string): Promise<{success: boolean, data?: FileEntry, error?: Error}>;
  listFiles(repositoryId: string, path?: string | null): Promise<{success: boolean, data?: FileListResponse, error?: Error}>;
  deleteFile(repositoryId: string, path: string): Promise<{success: boolean, data?: boolean, error?: Error}>;
  
  // Search methods
  search(searchRequest: SearchRequest): Promise<{success: boolean, data?: SearchResults, error?: Error}>;
  searchSuggestions(query: string, maxSuggestions?: number | null): Promise<{success: boolean, data?: string[], error?: Error}>;
  searchRepository(repositoryId: string, query: string, pagination?: PaginationParams | null): Promise<{success: boolean, data?: FileListResponse, error?: Error}>;
  
  // Public repository methods
  listPublicRepositories(pagination?: PaginationParams | null): Promise<{success: boolean, data?: RepositoryListResponse, error?: Error}>;
  searchPublicRepositories(searchQuery: string, pagination?: PaginationParams | null): Promise<{success: boolean, data?: RepositoryListResponse, error?: Error}>;
  getRepositoryStats(): Promise<{success: boolean, data?: RepositoryStats, error?: Error}>;
  
  // System methods
  health(): Promise<boolean>;
  
  // Utility methods
  fileToUint8Array(file: File): Promise<number[]>;
  uint8ArrayToString(uint8Array: number[]): string;
  stringToUint8Array(str: string): number[];
  formatTimestamp(timestamp: number | bigint): string;
  formatFileSize(bytes: number): string;
  getErrorMessage(error: unknown): string;
  retryRequest<T>(requestFn: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>;

  getFileTree(repositoryId: string, path?: string | null): Promise<{
    success: boolean;
    data?: FileTreeResponse;
    error?: Error;
  }>;
  
  // Add other file-related methods
  createFolder(repositoryId: string, path: string, name: string): Promise<{
    success: boolean;
    data?: any;
    error?: Error;
  }>;
  
  deleteFolder(repositoryId: string, path: string): Promise<{
    success: boolean;
    data?: boolean;
    error?: Error;
  }>;
}

// Declare the default export
declare const apiService: ApiService;
export default apiService;
