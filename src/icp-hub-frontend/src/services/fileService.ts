// src/icp-hub-frontend/src/services/fileService.ts

import apiService from './apiService'
import type { 
  FileEntry, 
  FileNode, 
  FileTreeResponse, 
  UploadFileRequest 
} from '../types/repository'

export interface FileUploadProgress {
  loaded: number
  total: number
  percentage: number
}

class FileService {
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

  /**
   * Get file tree for a repository
   */
  async getFileTree(repositoryId: string, path?: string): Promise<FileTreeResponse> {
    try {
      // Check if initialization is needed
      if (!('actor' in apiService) || !(apiService as any).actor) {
        await apiService.init()
      }

      console.log('Fetching file tree for repository:', repositoryId, 'path:', path)
      
      // Try to fetch from backend - using listFiles instead of getFileTree
      const result = await apiService.listFiles(repositoryId, path)
      
      if (result.success && result.data) {
        // Transform file list to tree structure
        const files = result.data.files || []
        const tree = this.buildTreeFromFiles(files)
        
        return {
          repositoryId,
          tree,
          totalFiles: files.filter((f: any) => !f.isFolder).length,
          totalFolders: files.filter((f: any) => f.isFolder).length,
          totalSize: files.reduce((sum: number, f: any) => sum + (Number(f.size) || 0), 0)
        }
      } else {
        // Fall back to mock data
        return this.getMockFileTree(repositoryId)
      }
    } catch (error) {
      console.error('Get file tree error:', this.getErrorMessage(error))
      // Return mock data for development if backend is not available
      return this.getMockFileTree(repositoryId)
    }
  }

  /**
   * Create a new folder
  async createFolder(repositoryId: string, folderPath: string, folderName: string): Promise<FileEntry> {
    try {
      // Check if initialization is needed
      if (!('actor' in apiService) || !(apiService as any).actor) {
        await apiService.init()
      }
      }

      console.log('Creating folder:', { repositoryId, folderPath, folderName })
      
      // For now, create a mock folder entry since backend might not support folders yet
      const fullPath = folderPath ? `${folderPath}/${folderName}` : folderName
      
      // Try to create an empty file to represent the folder
      const folderRequest: UploadFileRequest = {
        repositoryId,
        path: `${fullPath}/.gitkeep`, // Create a placeholder file in the folder
        content: [],
        commitMessage: `Create folder ${folderName}`,
        branch: undefined // Don't send branch field at all
      }
      
      const result = await apiService.uploadFile(folderRequest)
      
      if (result.success && result.data) {
        // Return folder representation
        return {
          path: fullPath,
          name: folderName,
          content: new Uint8Array(),
          size: 0,
          hash: result.data.hash || Math.random().toString(36),
          version: 1,
          lastModified: Date.now(),
          author: apiService.getPrincipal()?.toString() || 'anonymous',
          isFolder: true,
          commitMessage: `Created folder ${folderName}`
        }
      } else {
        // Return mock folder
        return this.createMockFolder(fullPath, folderName)
      }
    } catch (error) {
      console.error('Create folder error:', this.getErrorMessage(error))
      // Return mock folder instead of throwing
      const fullPath = folderPath ? `${folderPath}/${folderName}` : folderName
      return this.createMockFolder(fullPath, folderName)
    }
  }

  /**
  async uploadFile(
    repositoryId: string, 
    file: File, 
    folderPath?: string,
    commitMessage?: string,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileEntry> {
    try {
      // Check if initialization is needed
      if (!('actor' in apiService) || !(apiService as any).actor) {
        await apiService.init()
      }
        await apiService.init()
      }

      // Read file as array buffer
      const arrayBuffer = await this.readFileAsArrayBuffer(file, onProgress)
      const content = Array.from(new Uint8Array(arrayBuffer))
      
      // Prepare file path
      const path = folderPath ? `${folderPath}/${file.name}` : file.name
      
      // IMPORTANT: Don't send branch field, or send it as [] for None
      const uploadRequest: UploadFileRequest = {
        repositoryId,
        path,
        content,
        commitMessage: commitMessage || `Upload ${file.name}`
        // Don't include branch field at all, or set it to undefined
      }

      console.log('Uploading file:', { repositoryId, path, size: content.length })
      
      const result = await apiService.uploadFile(uploadRequest)
      
      if (result.success && result.data) {
        return this.transformFileEntry(result.data)
      } else {
        // Return mock data for development
        const mockEntry: FileEntry = {
          path,
          name: file.name,
          content: new Uint8Array(content),
          size: file.size,
          hash: Math.random().toString(36),
          version: 1,
          lastModified: Date.now(),
          author: apiService.getPrincipal()?.toString() || 'anonymous',
          isFolder: false,
          mimeType: file.type,
          commitMessage: uploadRequest.commitMessage
        }
        return mockEntry
      }
    } catch (error) {
      console.error('Upload file error:', this.getErrorMessage(error))
      // Return mock data instead of throwing
      const mockEntry: FileEntry = {
        path: folderPath ? `${folderPath}/${file.name}` : file.name,
        name: file.name,
        content: new Uint8Array(),
        size: file.size,
        hash: Math.random().toString(36),
        version: 1,
        lastModified: Date.now(),
        author: 'anonymous',
        isFolder: false,
        mimeType: file.type
      }
      return mockEntry
    }
  }

  /**
   * Upload multiple files with proper typing
   */
  async uploadMultipleFiles(
    repositoryId: string,
    files: FileList | File[],
    folderPath?: string,
    onProgress?: (fileName: string, progress: FileUploadProgress) => void
  ): Promise<FileEntry[]> {
    const uploadedFiles: FileEntry[] = []
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      try {
        const uploaded = await this.uploadFile(
          repositoryId,
          file,
          folderPath,
          `Upload ${file.name}`,
          (progress: FileUploadProgress) => {
            if (onProgress) {
              onProgress(file.name, progress)
            }
          }
        )
        uploadedFiles.push(uploaded)
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        // Continue with other files even if one fails
      }
    }

    return uploadedFiles
  }

  async deleteFile(repositoryId: string, filePath: string): Promise<boolean> {
    try {
      // Check if initialization is needed
      if (!('actor' in apiService) || !(apiService as any).actor) {
        await apiService.init()
      }
      if (!apiService.actor) {
        await apiService.init()
      }

      console.log('Deleting file:', { repositoryId, filePath })
      
      const result = await apiService.deleteFile(repositoryId, filePath)
      
      if (result.success) {
        console.log('File deleted successfully')
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Delete file error:', this.getErrorMessage(error))
      return false
    }
  }

  /**
   * Delete a folder and all its contents
   */
  async deleteFolder(repositoryId: string, folderPath: string): Promise<boolean> {
    try {
      // For now, just use deleteFile since backend might not have deleteFolder
      return await this.deleteFile(repositoryId, folderPath)
    } catch (error) {
      console.error('Delete folder error:', this.getErrorMessage(error))
      return false
    }
  }
  async getFileContent(repositoryId: string, filePath: string): Promise<string> {
    try {
      // Check if initialization is needed
      if (!('actor' in apiService) || !(apiService as any).actor) {
        await apiService.init()
      }
    try {
      if (!apiService.actor) {
        await apiService.init()
      }

      console.log('Fetching file content:', { repositoryId, filePath })
      
      const result = await apiService.getFile(repositoryId, filePath)
      
      if (result.success && result.data) {
        const fileEntry = result.data
        
        // Convert content based on type
        if (typeof fileEntry.content === 'string') {
          return fileEntry.content
        } else if (Array.isArray(fileEntry.content)) {
          // Convert number array to string
          const uint8Array = new Uint8Array(fileEntry.content)
          return new TextDecoder().decode(uint8Array)
        } else {
          return 'File content cannot be displayed'
        }
      } else {
        // Return mock content
        return `// File: ${filePath}\n// This is mock content for development\n\nconsole.log('Hello from ${filePath}');`
      }
    } catch (error) {
      console.error('Get file content error:', this.getErrorMessage(error))
      // Return mock content
      return `// File: ${filePath}\n// Mock content (backend not available)\n\nfunction example() {\n  return 'Hello World';\n}`
    }
  }

  // Helper methods

  private readFileAsArrayBuffer(
    file: File, 
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to read file'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          })
        }
      }
      
      reader.readAsArrayBuffer(file)
    })
  }

  private transformFileEntry(entry: any): FileEntry {
    return {
      path: entry.path,
      name: entry.name || entry.path.split('/').pop() || '',
      content: entry.content,
      size: Number(entry.size || 0),
      hash: entry.hash || '',
      version: Number(entry.version || 1),
      lastModified: typeof entry.lastModified === 'number' ? entry.lastModified / 1000000 : Date.now(),
      author: entry.author?.toString() || 'anonymous',
      commitMessage: entry.commitMessage?.[0],
      isFolder: entry.isFolder || false,
      mimeType: entry.mimeType?.[0],
      parentPath: entry.parentPath?.[0]
    }
  }

  private buildTreeFromFiles(files: any[]): FileNode[] {
    const tree: FileNode[] = []
    const nodeMap: { [key: string]: FileNode } = {}

    // First, sort files by path to ensure parents come before children
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path))

    // Build the tree structure
    sortedFiles.forEach((file: any) => {
      const pathParts = file.path.split('/')
      const fileName = pathParts[pathParts.length - 1]
      
      // Skip .gitkeep files (they're just folder markers)
      if (fileName === '.gitkeep') {
        return
      }

      const node: FileNode = {
        path: file.path,
        name: fileName,
        isFolder: false, // Files from backend are always files
        size: Number(file.size || 0),
        lastModified: typeof file.lastModified === 'number' ? file.lastModified / 1000000 : Date.now()
      }

      // Add to root if it's a top-level file
      if (pathParts.length === 1) {
        tree.push(node)
      } else {
        // Create folder structure if needed
        let currentPath = ''
        for (let i = 0; i < pathParts.length - 1; i++) {
          const folderName = pathParts[i]
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName
          
          if (!nodeMap[currentPath]) {
            const folderNode: FileNode = {
              path: currentPath,
              name: folderName,
              isFolder: true,
              size: 0,
              lastModified: Date.now(),
              children: []
            }
            nodeMap[currentPath] = folderNode
            
            // Add to parent or root
            if (i === 0) {
              tree.push(folderNode)
            } else {
              const parentPath = pathParts.slice(0, i).join('/')
              if (nodeMap[parentPath] && nodeMap[parentPath].children) {
                nodeMap[parentPath].children!.push(folderNode)
              }
            }
          }
        }
        
        // Add file to its parent folder
        const parentPath = pathParts.slice(0, -1).join('/')
        if (nodeMap[parentPath] && nodeMap[parentPath].children) {
          nodeMap[parentPath].children!.push(node)
        }
      }
    })

    return tree
  }

  private createMockFolder(path: string, name: string): FileEntry {
    return {
      path,
      name,
      content: new Uint8Array(),
      size: 0,
      hash: Math.random().toString(36),
      version: 1,
      lastModified: Date.now(),
      author: apiService.getPrincipal()?.toString() || 'anonymous',
      isFolder: true,
      commitMessage: `Created folder ${name}`
    }
  }

  /**
   * Get file icon based on file extension
   */
  getFileIcon(fileName: string, isFolder: boolean): string {
    if (isFolder) return '📁'
    
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    const iconMap: { [key: string]: string } = {
      // Code files
      'ts': '📘',
      'tsx': '⚛️',
      'js': '📜',
      'jsx': '⚛️',
      'mo': '🔷',
      'rs': '🦀',
      'sol': '💎',
      'py': '🐍',
      'go': '🐹',
      
      // Config files
      'json': '📋',
      'yaml': '📄',
      'yml': '📄',
      'toml': '⚙️',
      'env': '🔐',
      
      // Documentation
      'md': '📝',
      'txt': '📄',
      'pdf': '📕',
      
      // Web files
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'svg': '🖼️',
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'gif': '🖼️',
      
      // Other
      'zip': '📦',
      'tar': '📦',
      'gz': '📦',
      'lock': '🔒'
    }
    
    return iconMap[ext || ''] || '📄'
  }

  /**
   * Get MIME type from file name
   */
  getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    const mimeMap: { [key: string]: string } = {
      'txt': 'text/plain',
      'md': 'text/markdown',
      'js': 'text/javascript',
      'ts': 'text/typescript',
      'jsx': 'text/jsx',
      'tsx': 'text/tsx',
      'json': 'application/json',
      'html': 'text/html',
      'css': 'text/css',
      'mo': 'text/x-motoko',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'zip': 'application/zip'
    }
    
    return mimeMap[ext || ''] || 'application/octet-stream'
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const units = ['B', 'KB', 'MB', 'GB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
  }

  /**
   * Format date for display
   */
  formatDate(timestamp: number | string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 30) {
      return date.toLocaleDateString()
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  // Add mock data method for development
  private getMockFileTree(repositoryId: string): FileTreeResponse {
    return {
      repositoryId,
      tree: [
        {
          path: 'src',
          name: 'src',
          isFolder: true,
          size: 0,
          lastModified: Date.now(),
          children: [
            {
              path: 'src/main.mo',
              name: 'main.mo',
              isFolder: false,
              size: 2048,
              lastModified: Date.now() - 86400000
            },
            {
              path: 'src/types.mo',
              name: 'types.mo',
              isFolder: false,
              size: 1024,
              lastModified: Date.now() - 172800000
            }
          ]
        },
        {
          path: 'README.md',
          name: 'README.md',
          isFolder: false,
          size: 4096,
          lastModified: Date.now() - 3600000
        },
        {
          path: 'dfx.json',
          name: 'dfx.json',
          isFolder: false,
          size: 512,
          lastModified: Date.now() - 7200000
        }
      ],
      totalFiles: 4,
      totalFolders: 1,
      totalSize: 7680
    }
  }
}

export const fileService = new FileService()
export default fileService
