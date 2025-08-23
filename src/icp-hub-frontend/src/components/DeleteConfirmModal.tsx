import React from 'react'
import './DeleteConfirmModal.css'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType: 'file' | 'folder'
  isDeleting: boolean
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isDeleting
}) => {
  if (!isOpen) return null

  const getWarningMessage = () => {
    if (itemType === 'folder') {
      return `This will permanently delete the folder "${itemName}" and all its contents. This action cannot be undone.`
    }
    return `This will permanently delete the file "${itemName}". This action cannot be undone.`
  }

  const getIcon = () => {
    return itemType === 'folder' ? '📁' : '📄'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <span className="warning-icon">⚠️</span>
            <h2>Delete {itemType}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="item-info">
            <span className="item-icon">{getIcon()}</span>
            <span className="item-name">{itemName}</span>
          </div>
          
          <div className="warning-message">
            {getWarningMessage()}
          </div>

          <div className="warning-details">
            <div className="warning-item">
              <span className="warning-bullet">•</span>
              <span>This action is irreversible</span>
            </div>
            <div className="warning-item">
              <span className="warning-bullet">•</span>
              <span>All data will be permanently lost</span>
            </div>
            {itemType === 'folder' && (
              <div className="warning-item">
                <span className="warning-bullet">•</span>
                <span>All files and subfolders will be deleted</span>
              </div>
            )}
          </div>

          <div className="confirmation-input">
            <label htmlFor="confirmDelete">
              Type <strong>DELETE</strong> to confirm:
            </label>
            <input
              id="confirmDelete"
              type="text"
              placeholder="DELETE"
              className="confirm-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value === 'DELETE') {
                  onConfirm()
                }
              }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : `Delete ${itemType}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
