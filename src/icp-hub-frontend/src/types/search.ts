export type SearchType = 'all' | 'code' | 'users' | 'files' | 'repository'

export interface SearchResult {
  id: string
  title: string
  description: string
  type: SearchType
  url: string
  metadata?: Record<string, any>
}
