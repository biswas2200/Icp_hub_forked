import './App.css'
import { useState, useEffect } from 'react'
import Repositories from './components/Repositories'
import ImportGitHub from './components/ImportGitHub'
import Governance from './components/Governance'
import Documentation from './components/Documentation'
import GitOperations from './components/GitOperations'
import RepositoryStats from './components/RepositoryStats'
import { WalletProvider, useWallet } from './services/walletService'
import WalletConnectionModal from './components/WalletConnectionModal'
import UnifiedSearch from './components/UnifiedSearch'
import SearchResults from './components/SearchResults'


import type { SearchType, SearchResult } from './types'

function AppContent() {
  const [currentSection, setCurrentSection] = useState<'home' | 'repositories' | 'governance' | 'documentation' | 'import-github' | 'git-operations' | 'stats' | 'profile'>('home')
  const [showWalletModal, setShowWalletModal] = useState(false)

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentSearchQuery, setCurrentSearchQuery] = useState('')
  const [currentSearchType, setCurrentSearchType] = useState<SearchType>('all')

  const walletContext = useWallet()

    const handleSearch = (query: string, type: SearchType) => {
    console.log(`Searching for: "${query}" in category: ${type}`)
    setCurrentSearchQuery(query)
    setCurrentSearchType(type)
    
    // Mock search results for demonstration
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `Search result for "${query}"`,
        description: `This is a mock search result for the query "${query}" in the ${type} category.`,
        type: type,
        url: '#',
        metadata: { category: type, relevance: 'high' }
      },
      {
        id: '2',
        title: `Another result for "${query}"`,
        description: `Additional search result showing how the search functionality works.`,
        type: type,
        url: '#',
        metadata: { category: type, relevance: 'medium' }
      }
    ]
    
    setSearchResults(mockResults)
    setShowSearchResults(true)
  }

  const closeSearchResults = () => {
    setShowSearchResults(false)
    setSearchResults([])
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSearchResults) {
        closeSearchResults()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSearchResults])

  // Safe access to wallet with fallback
  const wallet = walletContext?.wallet || { connected: false, principal: '', walletType: 'none' }
  const disconnect = walletContext?.disconnect || (() => {})

  return (
    <div className="okh-root">

      
      {/* Navigation */}
      <nav className="okh-nav">
        <div className="okh-nav-container">
          <a href="#" className="okh-logo" onClick={() => setCurrentSection('home')}>OpenKeyHub</a>
          
          <div className="okh-nav-center">
            <UnifiedSearch 
              onSearch={handleSearch} 
              className="navbar-search" 
              placeholder="Search repositories, code, users, files..."
            />
          </div>
          
          <div className="okh-nav-links">
            <a
              href="#repositories"
              className={`okh-nav-link ${currentSection === 'repositories' ? 'active' : ''}`}
              onClick={() => setCurrentSection('repositories')}
            >
              Repositories
            </a>
            <a
              href="#import-github"
              className={`okh-nav-link ${currentSection === 'import-github' ? 'active' : ''}`}
              onClick={() => setCurrentSection('import-github')}
            >
              Import GitHub
            </a>
            <a
              href="#governance"
              className={`okh-nav-link ${currentSection === 'governance' ? 'active' : ''}`}
              onClick={() => setCurrentSection('governance')}
            >
              Governance
            </a>
            <a
              href="#documentation"
              className={`okh-nav-link ${currentSection === 'documentation' ? 'active' : ''}`}
              onClick={() => setCurrentSection('documentation')}
            >
              Documentation
            </a>

            <a
              href="#git-operations"
              className={`okh-nav-link ${currentSection === 'git-operations' ? 'active' : ''}`}
              onClick={() => setCurrentSection('git-operations')}
            >
              Git
            </a>
            <a
              href="#stats"
              className={`okh-nav-link ${currentSection === 'stats' ? 'active' : ''}`}
              onClick={() => setCurrentSection('stats')}
            >
              Stats
            </a>

          </div>
          {wallet.connected ? (
            <div className="okh-wallet-info">
              <span className="okh-wallet-type">{wallet.walletType}</span>
              <span className="okh-wallet-address">
                {wallet.principal && wallet.principal.length > 8 
                  ? `${wallet.principal.slice(0, 8)}...${wallet.principal.slice(-4)}`
                  : wallet.principal
                }
              </span>
              <button 
                className="okh-profile-btn" 
                onClick={() => setCurrentSection('profile')}
              >
                Profile
              </button>
              <button className="okh-disconnect-btn" onClick={disconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="okh-connect-btn" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {currentSection === 'home' ? (
        <>
          {/* Hero Section */}
          <header className="okh-hero">
            <div className="okh-container">
              <h1 className="okh-title">OpenKeyHub</h1>
              <p className="okh-tagline">
                A comprehensive multichain development platform to build, deploy, and manage Web3 applications across Ethereum,
                Internet Computer, Polygon, BSC, Avalanche, and more.
              </p>
              <div className="okh-cta-group">
                <a href="#get-started" className="okh-btn-primary">Get Started</a>
                <a href="#features" className="okh-btn-secondary">Explore Features</a>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="okh-main">
            <div className="okh-container">
              {/* Overview Section */}
              <section className="okh-section">
                <h2 className="okh-section-title">Why OpenKeyHub?</h2>
                <p className="okh-section-subtitle">
                  OpenKeyHub addresses fragmentation in Web3 by offering a single, intuitive interface that connects disparate
                  blockchain networks. Leverage unique capabilities of different chains while maintaining a consistent
                  development workflow.
                </p>
              </section>

              {/* Features Section */}
              <section className="okh-section" id="features">
                <h2 className="okh-section-title">Core Features</h2>
                <p className="okh-section-subtitle">
                  Everything you need to build, deploy, and manage multichain applications
                </p>

                <div className="okh-grid">
                  <div className="okh-card">
                    <h3 className="okh-card-title">Repository Management</h3>
                    <ul className="okh-list">
                      <li>Multi-chain repository creation and deployments</li>
                      <li>Collaborative development with role-based permissions</li>
                      <li>File management with uploads, organization, and versioning</li>
                      <li>Smart contract integration and auto-deployment</li>
                    </ul>
                  </div>

                  <div className="okh-card">
                    <h3 className="okh-card-title">Governance & DAO</h3>
                    <ul className="okh-list">
                      <li>Proposal creation and lifecycle management</li>
                      <li>Token-weighted voting mechanisms</li>
                      <li>Treasury management and fund operations</li>
                      <li>Built-in discussion forums for community engagement</li>
                    </ul>
                  </div>

                  <div className="okh-card">
                    <h3 className="okh-card-title">Authentication & Security</h3>
                    <ul className="okh-list">
                      <li>Multi-wallet support (MetaMask, Plug Wallet, and more)</li>
                      <li>Secure session management with API key support</li>
                      <li>Granular permission system for access control</li>
                      <li>Rate limiting and abuse protection mechanisms</li>
                    </ul>
                  </div>

                  <div className="okh-card">
                    <h3 className="okh-card-title">Developer Tools</h3>
                    <ul className="okh-list">
                      <li>Full Git operations: commits, branches, and merges</li>
                      <li>Advanced code search across repositories</li>
                      <li>One-click multi-chain deployment automation</li>
                      <li>Comprehensive analytics dashboard and insights</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Getting Started Section */}
              <section className="okh-section" id="get-started">
                <h2 className="okh-section-title">Getting Started</h2>
                <p className="okh-section-subtitle">
                  Get up and running with OpenKeyHub in just a few simple steps
                </p>
                <ol className="okh-steps">
                  <li>Clone the repository and install all required dependencies</li>
                  <li>Configure environment variables for your canisters and networks</li>
                  <li>Run the development server and connect your preferred wallet</li>
                  <li>Start building and deploying your multichain applications</li>
                </ol>
              </section>
            </div>
          </main>
        </>
      ) : currentSection === 'repositories' ? (
        <Repositories />
      ) : currentSection === 'import-github' ? (
        <ImportGitHub />
      ) : currentSection === 'governance' ? (
        <Governance />
      ) : currentSection === 'documentation' ? (
        <Documentation />
      ) : currentSection === 'git-operations' ? (
        <GitOperations repositoryId="demo" currentBranch="main" />
      ) : currentSection === 'stats' ? (
        <RepositoryStats />
      ) : currentSection === 'profile' ? (
        <div className="profile-section">
          <div className="okh-container">
            <h2>User Profile</h2>
            <p>Profile management coming soon...</p>
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <footer className="okh-footer">
        <div className="okh-container">
          <p>© {new Date().getFullYear()} OpenKeyHub. MIT Licensed. Built for the future of Web3.</p>
        </div>
      </footer>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />

      {/* Search Results Modal */}
      <SearchResults
        results={searchResults}
        query={currentSearchQuery}
        searchType={currentSearchType}
        isVisible={showSearchResults}
        onClose={closeSearchResults}
      />


    </div>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App
