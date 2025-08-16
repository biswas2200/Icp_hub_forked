// Debug helper to expose services to browser console
// Add this to your main.tsx or App.tsx

import apiService from './api.js'
import repositoryService from './repositoryService.ts'

// Helper function to safely get error message
function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Unknown error occurred'
}

// Expose services to window for debugging
if (typeof window !== 'undefined') {
  // @ts-ignore - add window augmentation
  window.debugServices = {
    api: apiService,
    repository: repositoryService,
    
    // Helper functions for common debugging tasks
    async checkAuth() {
      console.log('=== Authentication Status ===')
      console.log('Is Authenticated:', apiService.isAuthenticated)
      console.log('Current User:', apiService.currentUser)
      console.log('Principal:', apiService.isAuthenticated ? apiService.getPrincipal().toString() : 'Not authenticated')
      
      if (apiService.actor) {
        try {
          const health = await apiService.health()
          console.log('Backend Health:', health)
        } catch (error) {
          console.log('Backend Health Error:', getErrorMessage(error))
        }
      }
    },

    async listAllRepos() {
      console.log('=== Listing All Repositories ===')
      try {
        await repositoryService.debugListAllRepositories()
      } catch (error) {
        console.log('Error listing repositories:', getErrorMessage(error))
        
        // Try with mock data
        console.log('Falling back to mock data...')
        const mockRepos = await repositoryService.getRepositories()
        console.log('Mock repositories:', mockRepos)
      }
    },

    async getRepo(id) {
      console.log(`=== Getting Repository: ${id} ===`)
      try {
        const repo = await repositoryService.getRepository(id)
        console.log('Repository found:', repo)
        return repo
      } catch (error) {
        console.log('Error getting repository:', getErrorMessage(error))
        return null
      }
    },

    async testBackend() {
      console.log('=== Testing Backend Connection ===')
      
      // Check if actor exists
      if (!apiService.actor) {
        console.log('❌ No actor - trying to initialize...')
        try {
          await apiService.init()
          console.log('✅ Actor initialized')
        } catch (error) {
          console.log('❌ Failed to initialize actor:', getErrorMessage(error))
          return false
        }
      }

      // Test health endpoint
      try {
        const health = await apiService.health()
        console.log('✅ Health check:', health)
      } catch (error) {
        console.log('❌ Health check failed:', getErrorMessage(error))
      }

      // Test user query
      if (apiService.isAuthenticated) {
        try {
          const user = await apiService.getCurrentUser()
          console.log('✅ User query:', user ? 'Success' : 'User not found (normal for new users)')
        } catch (error) {
          console.log('❌ User query failed:', getErrorMessage(error))
        }
      }

      return true
    },

    // Quick repository creation test
    async createTestRepo(name = 'test-repo-' + Date.now()) {
      console.log(`=== Creating Test Repository: ${name} ===`)
      try {
        const repo = await repositoryService.createRepository({
          name: name,
          description: 'Test repository created from console',
          visibility: 'public',
          chains: ['ICP'],
          license: 'MIT',
          projectType: 'DeFi'
        })
        console.log('✅ Repository created:', repo)
        return repo
      } catch (error) {
        console.log('❌ Repository creation failed:', getErrorMessage(error))
        return null
      }
    }
  }

  // Shorthand aliases
  // @ts-ignore
  window.debugAuth = window.debugServices.checkAuth
  // @ts-ignore
  window.debugRepos = window.debugServices.listAllRepos
  // @ts-ignore
  window.debugBackend = window.debugServices.testBackend
  // @ts-ignore
  window.repositoryService = repositoryService
  // @ts-ignore
  window.apiService = apiService

  console.log('🐛 Debug services loaded! Available commands:')
  console.log('- window.debugAuth() - Check authentication status')
  console.log('- window.debugRepos() - List all repositories')
  console.log('- window.debugBackend() - Test backend connection')
  console.log('- window.debugServices.getRepo("repo_2") - Get specific repository')
  console.log('- window.debugServices.createTestRepo() - Create test repository')
  console.log('- window.repositoryService - Access repository service directly')
  console.log('- window.apiService - Access API service directly')
}