// src/services/api.d.ts
export interface ApiService {
  // Properties
  authClient: any
  actor: any
  isAuthenticated: boolean
  currentUser: any
  agent: any

  // Methods
  init(): Promise<boolean>
  setupActor(): Promise<void>
  setupAnonymousActor(): Promise<void>
  login(): Promise<boolean>
  logout(): Promise<boolean>
  getPrincipal(): any
  backendLogin(): Promise<{success: boolean, data?: any, error?: any}>
  getAuthContext(): Promise<{success: boolean, data?: any, error?: any}>
  getCurrentUser(): Promise<any>
  registerUser(userData: any): Promise<{success: boolean, data?: any, error?: any}>
  updateUserProfile(profileData: any): Promise<{success: boolean, data?: any, error?: any}>
  getUser(principal: any): Promise<{success: boolean, data?: any, error?: any}>
  createRepository(repoData: any): Promise<{success: boolean, data?: any, error?: any}>
  getRepository(repositoryId: string): Promise<{success: boolean, data?: any, error?: any}>
  listRepositories(owner: any, pagination?: any): Promise<{success: boolean, data?: any, error?: any}>
  updateRepository(repositoryId: string, updateData: any): Promise<{success: boolean, data?: any, error?: any}>
  deleteRepository(repositoryId: string): Promise<{success: boolean, data?: any, error?: any}>
  uploadFile(fileData: any): Promise<{success: boolean, data?: any, error?: any}>
  getFile(repositoryId: string, path: string): Promise<{success: boolean, data?: any, error?: any}>
  listFiles(repositoryId: string, path?: string): Promise<{success: boolean, data?: any, error?: any}>
  deleteFile(repositoryId: string, path: string): Promise<{success: boolean, data?: any, error?: any}>
  search(searchRequest: any): Promise<{success: boolean, data?: any, error?: any}>
  searchSuggestions(query: string, maxSuggestions?: number): Promise<{success: boolean, data?: any, error?: any}>
  searchRepository(repositoryId: string, query: string, pagination?: any): Promise<{success: boolean, data?: any, error?: any}>
  health(): Promise<boolean>
  fileToUint8Array(file: File): Promise<number[]>
  uint8ArrayToString(uint8Array: number[]): string
  stringToUint8Array(str: string): number[]
  formatTimestamp(timestamp: any): string
  formatFileSize(bytes: number): string
  getErrorMessage(error: any): string
  isAuthenticationValid(): Promise<boolean>
  retryRequest(requestFn: () => Promise<any>, maxRetries?: number, delay?: number): Promise<any>
}

declare const apiService: ApiService
export default apiService