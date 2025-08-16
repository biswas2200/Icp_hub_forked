import './App.css'
import { useState } from 'react'
import Repositories from './components/Repositories'
import Governance from './components/Governance'
import Documentation from './components/Documentation'
import { WalletProvider, useWallet } from './services/walletService'
import WalletConnectionModal from './components/WalletConnectionModal'

function AppContent() {
  const [currentSection, setCurrentSection] = useState<'home' | 'repositories' | 'governance' | 'documentation'>('home')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const walletContext = useWallet()

  // Safe access to wallet with fallback
  const wallet = walletContext?.wallet || { connected: false, principal: '', walletType: 'none' }
  const disconnect = walletContext?.disconnect || (() => {})

  return (
    <div className="okh-root">
      {/* Navigation */}
      <nav className="okh-nav">
        <div className="okh-nav-container">
          <a href="#" className="okh-logo" onClick={() => setCurrentSection('home')}>OpenKeyHub</a>
          <div className="okh-nav-links">
            <a
              href="#repositories"
              className={`okh-nav-link ${currentSection === 'repositories' ? 'active' : ''}`}
              onClick={() => setCurrentSection('repositories')}
            >
              Repositories
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
                <div className="okh-section-header">
                  <h2 className="okh-section-title">Why OpenKeyHub?</h2>
                  <p className="okh-section-subtitle">
                    OpenKeyHub addresses fragmentation in Web3 by offering a single, intuitive interface that connects disparate
                    blockchain networks. Leverage unique capabilities of different chains while maintaining a consistent
                    development workflow.
                  </p>
                </div>
              </section>

              {/* Features Section */}
              <section className="okh-section" id="features">
                <div className="okh-section-header">
                  <h2 className="okh-section-title">Core Features</h2>
                  <p className="okh-section-subtitle">
                    Everything you need to build, deploy, and manage multichain applications
                  </p>
                </div>

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
                <div className="okh-section-header">
                  <h2 className="okh-section-title">Getting Started</h2>
                  <p className="okh-section-subtitle">
                    Get up and running with OpenKeyHub in just a few simple steps
                  </p>
                </div>
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
      ) : currentSection === 'governance' ? (
        <Governance />
      ) : currentSection === 'documentation' ? (
        <Documentation />
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
