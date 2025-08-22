import { useState, useEffect, useRef } from 'react'
import './UnifiedSearch.css'
import type { SearchType } from '../types'

interface UnifiedSearchProps {
  onSearch: (query: string, type: SearchType) => void
  placeholder?: string
  className?: string
}

export default function UnifiedSearch({ onSearch, placeholder = "Search OpenKeyHub...", className = "" }: UnifiedSearchProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const searchTypes = [
    { value: 'all', label: 'All', icon: '🔍' },
    { value: 'code', label: 'Code', icon: '💻' },
    { value: 'users', label: 'Users', icon: '👥' },
    { value: 'files', label: 'Files', icon: '📁' },
    { value: 'repository', label: 'Repository', icon: '📦' }
  ]

  // Handle clicks outside dropdown and keyboard shortcuts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)
      try {
        await onSearch(query.trim(), searchType)
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleTypeSelect = (type: SearchType) => {
    setSearchType(type)
    setIsDropdownOpen(false)
  }

  const getCurrentTypeLabel = () => {
    const currentType = searchTypes.find(type => type.value === searchType)
    return currentType ? `${currentType.icon} ${currentType.label}` : 'All'
  }

  return (
    <div className={`unified-search ${className}`}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-type-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="search-type-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select search type"
          >
            {getCurrentTypeLabel()}
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="search-type-menu">
              {searchTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`search-type-option ${searchType === type.value ? 'active' : ''}`}
                  onClick={() => handleTypeSelect(type.value as SearchType)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="search-input"
            aria-label="Search query"
          />
          <button 
            type="submit" 
            className={`search-submit-btn ${isSearching ? 'searching' : ''}`} 
            aria-label="Search"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="search-spinner"></div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
