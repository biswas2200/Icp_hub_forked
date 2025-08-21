import { createContext, useContext, useState, useEffect } from 'react'
import apiService from './api.js'

// Create the WalletContext
const WalletContext = createContext(null)

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    console.warn('useWallet called outside of WalletProvider, returning default values')
    return {
      wallet: { connected: false, principal: '', walletType: 'none' },
      disconnect: () => {},
      connect: async () => ({ success: false })
    }
  }
  return context
}

// Wallet Provider Component
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState({
    connected: false,
    principal: '',
    accountId: '',
    walletType: 'none'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      console.log('Initializing authentication...')
      setLoading(true)
      setError(null)
      
      // Initialize API service
      await apiService.init()
      
      if (apiService.isAuthenticated) {
        const principal = apiService.getPrincipal()
        if (principal) {
          const principalText = principal.toString()
          
          setWallet({
            connected: true,
            principal: principalText,
            accountId: principalText,
            walletType: 'internet_identity'
          })
          
          // Try to get existing user
          const currentUser = await apiService.getCurrentUser()
          
          if (!currentUser) {
            console.log('User not authenticated')
          } else {
            console.log('User already authenticated:', principalText)
          }
        }
      } else {
        console.log('User not authenticated')
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const connectInternetIdentity = async () => {
  console.log('Starting Internet Identity connection...')
  
  try {
    const result = await apiService.login()
    
    if (result) {
      const principal = apiService.getPrincipal()
      
      if (principal) {
        // Get or create user
        let user = await apiService.getCurrentUser()
        
        if (!user) {
          // Register new user
          const registerResult = await apiService.registerUser({
            username: `user_${principal.toText().slice(0, 10)}`,
            email: [],
            profile: {
              displayName: [],
              bio: [],
              avatar: [],
              location: [],
              website: [],
              socialLinks: {
                twitter: [],
                github: [],
                linkedin: []
              }
            }
          })
          
          if (registerResult.success) {
            user = registerResult.data
          }
        }
        
        // Update wallet state - this should trigger re-renders
        setWallet({
          connected: true,
          principal: principal.toString(),
          accountId: principal.toString(),
          walletType: 'internet_identity',
          user: user
        })
        
        console.log('Internet Identity connected successfully:', principal.toString())
        
        // Force a re-render by updating React context or emitting an event
        // If you're using a React context, make sure to update it here
        // If you're using an event emitter, emit a 'walletConnected' event
        
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Internet Identity connection failed:', error)
    this.updateWalletState({
      connected: false,
      principal: null,
      accountId: null,
      provider: null,
      balance: null,
      user: null
    })
    throw error
  }
}

const disconnect = async () => {
  try {
    await apiService.logout()
    
    // Reset wallet state - this should trigger re-renders
    setWallet({
      connected: false,
      principal: null,
      accountId: null,
      provider: null,
      balance: null,
      user: null
    })
    
    console.log('Wallet disconnected successfully')
    
    // Force a re-render by updating React context or emitting an event
    // If you're using a React context, make sure to update it here
    // If you're using an event emitter, emit a 'walletDisconnected' event
    
    return true
  } catch (error) {
    console.error('Disconnect failed:', error)
    throw error
  }
}


  // Utility functions
  const formatAddress = (addr) => {
    if (!addr) return ''
    if (addr.length <= 10) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const isAuthAvailable = () => {
    return typeof window !== 'undefined'
  }

  const value = {
    // Wallet state
    wallet,
    loading,
    error,
    
    // Authentication methods
    connect: connectInternetIdentity,
    connectInternetIdentity,
    disconnect,
    
    // Utility methods
    formatAddress,
    isAuthAvailable,
    
    // For backward compatibility
    isConnected: wallet.connected,
    currentUser: wallet.connected ? { principal: wallet.principal } : null,
    principal: wallet.principal,
    address: wallet.principal,
    setError
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContext
