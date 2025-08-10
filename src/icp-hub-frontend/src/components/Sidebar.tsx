import { useState, useEffect } from 'react'
import { useWallet } from '../services/walletService'
import WalletConnectionModal from './WalletConnectionModal'
import './Sidebar.css'

interface SidebarProps {
  currentSection: 'home' | 'repositories' | 'governance' | 'documentation'
  onSectionChange: (section: 'home' | 'repositories' | 'governance' | 'documentation') => void
}

interface NavItem {
  id: 'home' | 'repositories' | 'governance' | 'documentation'
  label: string
  icon: string
  description: string
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    description: 'Dashboard overview'
  },
  {
    id: 'repositories',
    label: 'Repositories',
    icon: '📁',
    description: 'Manage your projects'
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: '🗳️',
    description: 'DAO proposals & voting'
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: '📚',
    description: 'Help & guides'
  }
]

function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { wallet, disconnect } = useWallet()

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Collapse sidebar when section changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true)
      setIsMobileOpen(false)
    }
  }, [currentSection])

  const handleNavClick = (section: 'home' | 'repositories' | 'governance' | 'documentation') => {
    onSectionChange(section)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle mobile menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🔑</span>
            {!isCollapsed && <span className="logo-text">OpenKeyHub</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.description : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {wallet.connected ? (
            <div className="wallet-info">
              <div className="wallet-header">
                <span className="wallet-type">{wallet.walletType}</span>
                {!isCollapsed && (
                  <button className="disconnect-btn" onClick={disconnect}>
                    Disconnect
                  </button>
                )}
              </div>
              {!isCollapsed && (
                <div className="wallet-address">
                  {wallet.principal.slice(0, 8)}...{wallet.principal.slice(-4)}
                </div>
              )}
            </div>
          ) : (
            <button 
              className="connect-wallet-btn"
              onClick={() => setShowWalletModal(true)}
            >
              {!isCollapsed && <span>Connect Wallet</span>}
              <span className="connect-icon">🔗</span>
            </button>
          )}
        </div>
      </div>

      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  )
}

export default Sidebar 