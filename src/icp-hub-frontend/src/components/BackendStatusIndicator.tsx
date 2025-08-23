import React, { useState, useEffect } from 'react'
import apiService from '../services/api.js'
import './BackendStatusIndicator.css'

interface BackendStatusIndicatorProps {
  className?: string
}

const BackendStatusIndicator: React.FC<BackendStatusIndicatorProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking')
  const [message, setMessage] = useState('Checking backend connection...')

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      setStatus('checking')
      setMessage('Checking backend connection...')

      // Initialize API service if not already done
      if (!apiService.actor) {
        await apiService.init()
      }

      // Check backend availability
      const isAvailable = await apiService.checkBackendAvailability()
      
      if (isAvailable) {
        setStatus('online')
        setMessage('Backend is online and responding')
      } else {
        setStatus('offline')
        setMessage('') // Don't show offline message
      }
    } catch (error) {
      setStatus('error')
      setMessage('') // Don't show error message
      console.error('Backend status check failed:', error)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return '⏳'
      case 'online':
        return '✅'
      case 'offline':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '❓'
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case 'checking':
        return 'status-checking'
      case 'online':
        return 'status-online'
      case 'offline':
        return 'status-offline'
      case 'error':
        return 'status-error'
      default:
        return 'status-unknown'
    }
  }

  return (
    <div className={`backend-status-indicator ${getStatusClass()} ${className}`}>
      {status === 'online' && (
        <>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-message">{message}</span>
        </>
      )}
    </div>
  )
}

export default BackendStatusIndicator

