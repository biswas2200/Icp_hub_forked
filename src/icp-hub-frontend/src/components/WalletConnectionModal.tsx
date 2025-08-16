import { useState } from 'react'
import { useWallet } from '../services/walletService'
import type { WalletType } from '../services/walletService'
import './WalletConnectionModal.css'

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface WalletOption {
  type: WalletType
  name: string
  description: string
  icon: string
  color: string
}

const walletOptions: WalletOption[] = [
  {
    type: 'plug',
    name: 'Plug Wallet',
    description: 'The most popular ICP wallet with browser extension',
    icon: '🔌',
    color: '#6366f1'
  },
  {
    type: 'internet-identity',
    name: 'Internet Identity',
    description: 'Official ICP identity solution',
    icon: '🆔',
    color: '#10b981'
  },
  {
    type: 'stoic',
    name: 'Stoic Wallet',
    description: 'Secure ICP wallet with advanced features',
    icon: '🛡️',
    color: '#f59e0b'
  },
  {
    type: 'astrox',
    name: 'AstroX ME',
    description: 'Mobile-first ICP wallet',
    icon: '📱',
    color: '#8b5cf6'
  },
  {
    type: 'metamask',
    name: 'MetaMask',
    description: 'Ethereum wallet for cross-chain operations',
    icon: '🦊',
    color: '#f97316'
  }
]

function WalletConnectionModal({ isOpen, onClose }: WalletConnectionModalProps) {
  const { connect, isLoading, error } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)

  const handleWalletSelect = async (walletType: WalletType) => {
    setSelectedWallet(walletType)
    
    try {
      const success = await connect(walletType)
      if (success) {
        onClose()
      }
    } catch (err) {
      console.error('Wallet connection failed:', err)
    } finally {
      setSelectedWallet(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal-content" onClick={e => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2>Connect Your Wallet</h2>
          <button className="wallet-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>
        </div>

        <div className="wallet-modal-body">
          <p className="wallet-modal-description">
            Choose your preferred wallet to connect to OpenKeyHub and access all features.
          </p>

          <div className="wallet-options">
            {walletOptions.map((option) => (
              <button
                key={option.type}
                className={`wallet-option ${selectedWallet === option.type ? 'selected' : ''}`}
                onClick={() => handleWalletSelect(option.type)}
                disabled={isLoading}
                style={{ '--wallet-color': option.color } as React.CSSProperties}
              >
                <div className="wallet-option-icon">
                  <span>{option.icon}</span>
                </div>
                <div className="wallet-option-content">
                  <h3>{option.name}</h3>
                  <p>{option.description}</p>
                </div>
                {selectedWallet === option.type && isLoading && (
                  <div className="wallet-option-loading">
                    <div className="loading-spinner"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="wallet-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="wallet-modal-footer">
            <p className="wallet-security-note">
              🔒 Your wallet connection is secure and private. We never store your private keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletConnectionModal