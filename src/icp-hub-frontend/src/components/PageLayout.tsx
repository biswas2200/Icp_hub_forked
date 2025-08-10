import type { ReactNode } from 'react'
import './PageLayout.css'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

function PageLayout({ children, className = '', fullWidth = false }: PageLayoutProps) {
  return (
    <div className={`page-layout ${fullWidth ? 'full-width' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default PageLayout 