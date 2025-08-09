// Main API service for ICP Hub backend integration
// This service handles all backend communication and provides a unified interface

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
}

class ApiService {
  private config: ApiConfig
  private authToken: string | null = null

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4943',
      timeout: 30000,
      retries: 3
    }
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.authToken = token
  }

  // Clear authentication token
  clearAuthToken() {
    this.authToken = null
  }

  // Get headers for requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  // Make HTTP request with retry logic
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const requestOptions: RequestInit = {
      headers: this.getHeaders(),
      ...options
    }

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return { success: true, data }
      } catch (error) {
        console.error(`API request failed (attempt ${attempt}):`, error)
        
        if (attempt === this.config.retries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    return {
      success: false,
      error: 'Request failed after all retries'
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.config.baseUrl}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.makeRequest<T>(url.pathname + url.search)
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE'
    })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // Upload file
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const headers = this.getHeaders()
    delete (headers as any)['Content-Type'] // Let browser set content-type for FormData

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: number }>> {
    return this.get<{ status: string; timestamp: number }>('/health')
  }

  // Get system stats
  async getSystemStats(): Promise<ApiResponse<{
    totalUsers: number
    totalRepositories: number
    totalFiles: number
    totalStorage: number
  }>> {
    return this.get('/stats')
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService 