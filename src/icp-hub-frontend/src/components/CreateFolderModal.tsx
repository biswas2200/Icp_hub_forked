import React, { useState, useEffect, useRef } from 'react';
import './CreateFolderModal.css';

interface CreateFolderModalProps {
  currentPath: string;
  onClose: () => void;
  onCreate: (folderName: string) => void | Promise<void>;
}

function CreateFolderModal({ currentPath, onClose, onCreate }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous error
    setError(null);
    
    // Validate folder name
    if (!folderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }
    
    if (/[\\/:*?"<>|]/.test(folderName)) {
      setError('Folder name contains invalid characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onCreate(folderName.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2>Create New Folder</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Parent folder</label>
              <div className="parent-path">
                /{currentPath ? `${currentPath}/` : ''}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="folderName">Folder name</label>
              <input
                id="folderName"
                ref={inputRef}
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                className={error ? 'error' : ''}
                autoComplete="off"
              />
              {error && <span className="error-message">{error}</span>}
            </div>
            
            <div className="folder-tips">
              <div className="tip-title">Naming guidelines</div>
              <ul>
                <li>Use alphanumeric characters (a-z, 0-9)</li>
                <li>Avoid special characters (\/:*?"&lt;&gt;|)</li>
                <li>Keep names descriptive but concise</li>
                <li>Use hyphens (-) or underscores (_) instead of spaces</li>
              </ul>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFolderModal;
