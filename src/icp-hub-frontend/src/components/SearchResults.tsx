import type { SearchType, SearchResult } from '../types'
import './SearchResults.css'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  searchType: SearchType
  isVisible: boolean
  onClose: () => void
}

export default function SearchResults({ results, query, searchType, isVisible, onClose }: SearchResultsProps) {
  if (!isVisible) return null

  const getTypeIcon = (type: SearchType) => {
    const icons = {
      all: '🔍',
      code: '💻',
      users: '👥',
      files: '📁',
      repository: '📦'
    }
    return icons[type] || '🔍'
  }

  const getTypeLabel = (type: SearchType) => {
    const labels = {
      all: 'All',
      code: 'Code',
      users: 'Users',
      files: 'Files',
      repository: 'Repository'
    }
    return labels[type] || 'All'
  }

  return (
    <div className="search-results-overlay" onClick={onClose}>
      <div className="search-results-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-results-header">
          <h3>Search Results</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="search-results-info">
          <span className="search-query">"{query}"</span>
          <span className="search-type">
            {getTypeIcon(searchType)} {getTypeLabel(searchType)}
          </span>
          <span className="results-count">{results.length} results found</span>
        </div>

        <div className="search-results-list">
          {results.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h4>No results found</h4>
              <p>Try adjusting your search terms or search type</p>
            </div>
          ) : (
            results.map((result) => (
              <div key={result.id} className="search-result-item">
                <div className="result-header">
                  <span className="result-type-icon">
                    {getTypeIcon(result.type)}
                  </span>
                  <h4 className="result-title">{result.title}</h4>
                </div>
                <p className="result-description">{result.description}</p>
                <div className="result-meta">
                  <span className="result-type">{getTypeLabel(result.type)}</span>
                  {result.metadata && (
                    <span className="result-metadata">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <span key={key} className="meta-item">
                          {key}: {value}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
