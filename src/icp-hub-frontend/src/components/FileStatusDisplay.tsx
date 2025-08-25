import React, { useState, useEffect } from 'react'
import './FileStatusDisplay.css'

export interface FileOperation {
  id: string
  type: 'upload' | 'create-folder' | 'delete' | 'move' | 'copy'
  status: 'pending' | 'success' | 'error'
  message: string
  details?: string
  timestamp: Date
  progress?: number
}

interface FileStatusDisplayProps {
  operations: FileOperation[]
  onDismiss: (id: string) => void
  onClearAll: () => void
}

const FileStatusDisplay: React.FC<FileStatusDisplayProps> = ({
  operations,
  onDismiss,
  onClearAll
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [autoHide, setAutoHide] = useState(true)

  // Auto-hide success messages after 5 seconds
  useEffect(() => {
    if (autoHide && operations.some(op => op.status === 'success')) {
      const timer = setTimeout(() => {
        operations
          .filter(op => op.status === 'success')
          .forEach(op => onDismiss(op.id))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [operations, autoHide, onDismiss])

  if (operations.length === 0) return null

  const pendingOperations = operations.filter(op => op.status === 'pending')
  const successOperations = operations.filter(op => op.status === 'success')
  const errorOperations = operations.filter(op => op.status === 'error')

  const getOperationIcon = (type: string, status: string): string => {
    if (status === 'error') return '❌'
    if (status === 'pending') return '⏳'
    
    switch (type) {
      case 'upload': return '📤'
      case 'create-folder': return '📁'
      case 'delete': return '🗑️'
      case 'move': return '📋'
      case 'copy': return '📄'
      default: return '✅'
    }
  }

  const getOperationColor = (status: string): string => {
    switch (status) {
      case 'success': return 'success'
      case 'error': return 'error'
      case 'pending': return 'pending'
      default: return 'info'
    }
  }



  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <div className={`file-status-display ${isExpanded ? 'expanded' : ''}`}>
      <div className="status-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="status-summary">
          <span className="status-icon">📊</span>
          <span className="status-count">
            {operations.length} operation{operations.length !== 1 ? 's' : ''}
          </span>
          {pendingOperations.length > 0 && (
            <span className="pending-badge">{pendingOperations.length} pending</span>
          )}
          {errorOperations.length > 0 && (
            <span className="error-badge">{errorOperations.length} failed</span>
          )}
        </div>
        <div className="status-controls">
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
          <button
            className="clear-all-btn"
            onClick={(e) => {
              e.stopPropagation()
              onClearAll()
            }}
            title="Clear all"
          >
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="status-details">
          {/* Pending Operations */}
          {pendingOperations.length > 0 && (
            <div className="status-section">
              <h4 className="section-title pending">⏳ Pending Operations</h4>
              {pendingOperations.map(operation => (
                <div key={operation.id} className={`status-item ${getOperationColor(operation.status)}`}>
                  <div className="status-icon">{getOperationIcon(operation.type, operation.status)}</div>
                  <div className="status-content">
                    <div className="status-message">{operation.message}</div>
                    <div className="status-details">{operation.details}</div>
                    {operation.progress !== undefined && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${operation.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="status-time">{formatTimestamp(operation.timestamp)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Success Operations */}
          {successOperations.length > 0 && (
            <div className="status-section">
              <h4 className="section-title success">✅ Recent Successes</h4>
              {successOperations.slice(0, 5).map(operation => (
                <div key={operation.id} className={`status-item ${getOperationColor(operation.status)}`}>
                  <div className="status-icon">{getOperationIcon(operation.type, operation.status)}</div>
                  <div className="status-content">
                    <div className="status-message">{operation.message}</div>
                    <div className="status-details">{operation.details}</div>
                  </div>
                  <div className="status-actions">
                    <span className="status-time">{formatTimestamp(operation.timestamp)}</span>
                    <button
                      className="dismiss-btn"
                      onClick={() => onDismiss(operation.id)}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Operations */}
          {errorOperations.length > 0 && (
            <div className="status-section">
              <h4 className="section-title error">❌ Recent Errors</h4>
              {errorOperations.slice(0, 5).map(operation => (
                <div key={operation.id} className={`status-item ${getOperationColor(operation.status)}`}>
                  <div className="status-icon">{getOperationIcon(operation.type, operation.status)}</div>
                  <div className="status-content">
                    <div className="status-message">{operation.message}</div>
                    <div className="status-details">{operation.details}</div>
                  </div>
                  <div className="status-actions">
                    <span className="status-time">{formatTimestamp(operation.timestamp)}</span>
                    <button
                      className="dismiss-btn"
                      onClick={() => onDismiss(operation.id)}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Auto-hide toggle */}
          <div className="status-settings">
            <label className="auto-hide-toggle">
              <input
                type="checkbox"
                checked={autoHide}
                onChange={(e) => setAutoHide(e.target.checked)}
              />
              <span className="toggle-label">Auto-hide success messages</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileStatusDisplay
