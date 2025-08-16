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
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting Internet Identity connection...')
      
      // Use apiService to handle Internet Identity login
      const loginSuccess = await apiService.login()
      
      if (loginSuccess) {
        const principal = apiService.getPrincipal()
        const principalText = principal.toString()
        
        // Check if user exists
        let currentUser = await apiService.getCurrentUser()
        
        if (!currentUser) {
          console.log('User not found, registering new user...')
          
          // Register new user
          const registerResult = await apiService.registerUser({
            username: `user_${principalText.slice(0, 8)}`,
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
            currentUser = registerResult.data
            console.log('User registered successfully:', currentUser.username)
          } else {
            throw new Error('Failed to register user: ' + apiService.getErrorMessage(registerResult.error))
          }
        }
        
        setWallet({
          connected: true,
          principal: principalText,
          accountId: principalText,
          walletType: 'internet_identity'
        })
        
        console.log('Internet Identity connected successfully:', principalText)
        return { success: true, principal: principalText }
      } else {
        throw new Error('Failed to connect with Internet Identity')
      }
    } catch (error) {
      console.error('Internet Identity connection failed:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const disconnect = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Disconnecting wallet...')
      
      // Use apiService to handle logout
      await apiService.logout()
      
      setWallet({
        connected: false,
        principal: '',
        accountId: '',
        walletType: 'none'
      })
      
      console.log('Disconnected successfully')
      return { success: true }
    } catch (error) {
      console.error('Disconnect failed:', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
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
