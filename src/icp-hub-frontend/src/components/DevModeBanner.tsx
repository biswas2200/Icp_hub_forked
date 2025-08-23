import React from 'react'
import './DevModeBanner.css'

interface DevModeBannerProps {
  isVisible: boolean
  onClose: () => void
}

const DevModeBanner: React.FC<DevModeBannerProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="dev-mode-banner">
      <div className="banner-content">
        <span className="banner-icon">🛠️</span>
        <span className="banner-text">
          <strong>Development Mode:</strong> Running with mock data. Backend services are not available.
        </span>
        <button className="banner-close" onClick={onClose} title="Close banner">
          ✕
        </button>
      </div>
    </div>
  )
}

export default DevModeBanner

