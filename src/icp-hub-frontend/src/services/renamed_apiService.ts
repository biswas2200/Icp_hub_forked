export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface ApiConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

class ApiService {
  private baseUrl: string
  private timeout: number
  private authToken?: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4943'
    this.timeout = 10000
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  clearAuthToken() {
    this.authToken = undefined
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        data,
        status: response.status
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.makeRequest<T>(`${url}${queryString}`, {
      method: 'GET'
    })
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'DELETE'
    })
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append(fieldName, file)

    return this.makeRequest<T>(url, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
      body: formData
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health')
      return true
    } catch {
      return false
    }
  }

  async getSystemStats(): Promise<any> {
    return this.get('/stats')
  }
}

export const apiService = new ApiService()
export default apiService 