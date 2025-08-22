import { useState, useEffect, createContext, useContext } from 'react'
import type { ReactNode } from 'react'

// Wallet types
export interface WalletInfo {
  principal: string
  accountId?: string
  balance?: number
  connected: boolean
  walletType: WalletType
}

export type WalletType = 'plug' | 'internet-identity' | 'stoic' | 'astrox' | 'metamask' | 'none'

export interface WalletContextType {
  wallet: WalletInfo
  connect: (walletType: WalletType) => Promise<boolean>
  disconnect: () => void
  isLoading: boolean
  error: string | null
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Default wallet state
const defaultWallet: WalletInfo = {
  principal: '',
  connected: false,
  walletType: 'none'
}

// Wallet service class
class WalletService {
  private plugWallet: any = null
  private internetIdentity: any = null

  // Initialize Plug Wallet
  async initPlugWallet(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).ic?.plug) {
        this.plugWallet = (window as any).ic.plug
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to initialize Plug Wallet:', error)
      return false
    }
  }

  // Initialize Internet Identity
  async initInternetIdentity(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).ic?.internetIdentity) {
        this.internetIdentity = (window as any).ic.internetIdentity
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to initialize Internet Identity:', error)
      return false
    }
  }

  // Connect Plug Wallet
  async connectPlugWallet(): Promise<WalletInfo> {
    try {
      if (!this.plugWallet) {
        const initialized = await this.initPlugWallet()
        if (!initialized) {
          throw new Error('Plug Wallet not available')
        }
      }

      const connected = await this.plugWallet.requestConnect()
      if (!connected) {
        throw new Error('Failed to connect Plug Wallet')
      }

      const principal = await this.plugWallet.getPrincipal()
      const accountId = await this.plugWallet.accountId
      const balance = await this.plugWallet.getBalance()

      return {
        principal: principal.toString(),
        accountId: accountId?.toString(),
        balance: Number(balance?.e8s || 0) / 100000000,
        connected: true,
        walletType: 'plug'
      }
    } catch (error) {
      console.error('Plug Wallet connection failed:', error)
      throw error
    }
  }

  // Connect Internet Identity
  async connectInternetIdentity(): Promise<WalletInfo> {
    try {
      if (!this.internetIdentity) {
        const initialized = await this.initInternetIdentity()
        if (!initialized) {
          throw new Error('Internet Identity not available')
        }
      }

      const identity = await this.internetIdentity.connect()
      const principal = identity.getPrincipal()

      return {
        principal: principal.toString(),
        connected: true,
        walletType: 'internet-identity'
      }
    } catch (error) {
      console.error('Internet Identity connection failed:', error)
      throw error
    }
  }

  // Connect Stoic Wallet
  async connectStoicWallet(): Promise<WalletInfo> {
    try {
      if (typeof window === 'undefined' || !(window as any).ic?.stoic) {
        throw new Error('Stoic Wallet not available')
      }

      const stoic = (window as any).ic.stoic
      const connected = await stoic.connect()
      
      if (!connected) {
        throw new Error('Failed to connect Stoic Wallet')
      }

      const principal = await stoic.getPrincipal()
      const accountId = await stoic.accountId
      const balance = await stoic.getBalance()

      return {
        principal: principal.toString(),
        accountId: accountId?.toString(),
        balance: Number(balance?.e8s || 0) / 100000000,
        connected: true,
        walletType: 'stoic'
      }
    } catch (error) {
      console.error('Stoic Wallet connection failed:', error)
      throw error
    }
  }

  // Connect AstroX ME Wallet
  async connectAstroXWallet(): Promise<WalletInfo> {
    try {
      if (typeof window === 'undefined' || !(window as any).ic?.astrox) {
        throw new Error('AstroX ME Wallet not available')
      }

      const astrox = (window as any).ic.astrox
      const connected = await astrox.connect()
      
      if (!connected) {
        throw new Error('Failed to connect AstroX ME Wallet')
      }

      const principal = await astrox.getPrincipal()
      const accountId = await astrox.accountId
      const balance = await astrox.getBalance()

      return {
        principal: principal.toString(),
        accountId: accountId?.toString(),
        balance: Number(balance?.e8s || 0) / 100000000,
        connected: true,
        walletType: 'astrox'
      }
    } catch (error) {
      console.error('AstroX ME Wallet connection failed:', error)
      throw error
    }
  }

  // Connect MetaMask (for Ethereum integration)
  async connectMetaMask(): Promise<WalletInfo> {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not available')
      }

      const ethereum = (window as any).ethereum
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const account = accounts[0]
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      })

      return {
        principal: account,
        balance: parseInt(balance, 16) / 1e18,
        connected: true,
        walletType: 'metamask'
      }
    } catch (error) {
      console.error('MetaMask connection failed:', error)
      throw error
    }
  }

  // Disconnect wallet
  async disconnectWallet(walletType: WalletType): Promise<void> {
    try {
      switch (walletType) {
        case 'plug':
          if (this.plugWallet) {
            await this.plugWallet.disconnect()
          }
          break
        case 'internet-identity':
          if (this.internetIdentity) {
            await this.internetIdentity.disconnect()
          }
          break
        case 'stoic':
          if (typeof window !== 'undefined' && (window as any).ic?.stoic) {
            await (window as any).ic.stoic.disconnect()
          }
          break
        case 'astrox':
          if (typeof window !== 'undefined' && (window as any).ic?.astrox) {
            await (window as any).ic.astrox.disconnect()
          }
          break
        case 'metamask':
          // MetaMask doesn't have a disconnect method, just clear local state
          break
      }
    } catch (error) {
      console.error('Wallet disconnect failed:', error)
    }
  }

  // Get wallet balance
  async getBalance(walletType: WalletType): Promise<number> {
    try {
      switch (walletType) {
        case 'plug':
          if (this.plugWallet) {
            const balance = await this.plugWallet.getBalance()
            return Number(balance?.e8s || 0) / 100000000
          }
          break
        case 'stoic':
          if (typeof window !== 'undefined' && (window as any).ic?.stoic) {
            const balance = await (window as any).ic.stoic.getBalance()
            return Number(balance?.e8s || 0) / 100000000
          }
          break
        case 'astrox':
          if (typeof window !== 'undefined' && (window as any).ic?.astrox) {
            const balance = await (window as any).ic.astrox.getBalance()
            return Number(balance?.e8s || 0) / 100000000
          }
          break
        case 'metamask':
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })
            if (accounts.length > 0) {
              const balance = await (window as any).ethereum.request({
                method: 'eth_getBalance',
                params: [accounts[0], 'latest']
              })
              return parseInt(balance, 16) / 1e18
            }
          }
          break
      }
      return 0
    } catch (error) {
      console.error('Failed to get balance:', error)
      return 0
    }
  }
}

// Create wallet service instance
const walletService = new WalletService()

// Wallet Provider Component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(defaultWallet)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  console.log('WalletProvider initialized with wallet:', wallet)

  // Check for existing connections on mount
  useEffect(() => {
    let mounted = true
    
    console.log('WalletProvider useEffect triggered')
    
    const initConnections = async () => {
      if (mounted) {
        console.log('Checking existing connections...')
        await checkExistingConnections()
      }
    }
    
    initConnections()
    
    return () => {
      mounted = false
    }
  }, [])

  const checkExistingConnections = async () => {
    try {
      console.log('Starting to check existing connections...')
      // Check Plug Wallet
      if (await walletService.initPlugWallet()) {
        console.log('Plug wallet initialized, checking connection...')
        const isConnected = await (window as any).ic.plug.isConnected()
        console.log('Plug wallet connected:', isConnected)
        if (isConnected) {
          const walletInfo = await walletService.connectPlugWallet()
          console.log('Setting wallet info:', walletInfo)
          setWallet(walletInfo)
          return
        }
      }
      
      console.log('No existing connections found, using default wallet')
      // Check other wallet types if needed
      // Add checks for other wallet types here
    } catch (error) {
      console.error('Failed to check existing connections:', error)
    }
  }

  const connect = async (walletType: WalletType): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      let walletInfo: WalletInfo

      switch (walletType) {
        case 'plug':
          walletInfo = await walletService.connectPlugWallet()
          break
        case 'internet-identity':
          walletInfo = await walletService.connectInternetIdentity()
          break
        case 'stoic':
          walletInfo = await walletService.connectStoicWallet()
          break
        case 'astrox':
          walletInfo = await walletService.connectAstroXWallet()
          break
        case 'metamask':
          walletInfo = await walletService.connectMetaMask()
          break
        default:
          throw new Error('Unsupported wallet type')
      }

      setWallet(walletInfo)
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    try {
      if (wallet.connected && wallet.walletType !== 'none') {
        await walletService.disconnectWallet(wallet.walletType)
      }
      setWallet(defaultWallet)
      setError(null)
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  const value: WalletContextType = {
    wallet,
    connect,
    disconnect,
    isLoading,
    error
  }
  
  console.log('WalletProvider value created:', value)

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

// Hook to use wallet context
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext)
  if (context === undefined) {
    console.error('useWallet must be used within a WalletProvider')
    // Return a default context instead of throwing
    return {
      wallet: defaultWallet,
      connect: async () => false,
      disconnect: async () => {},
      isLoading: false,
      error: 'Wallet context not available'
    }
  }
  return context
}

export default walletService 