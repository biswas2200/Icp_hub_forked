import React, { useState, useEffect } from 'react';
import apiService from '../services/api.js';
import './FileExplorer.css';

export interface FileNode {
  path: string;
  name: string;
  isFolder: boolean;
  size: number;
  lastModified: string | number;
  children?: FileNode[];
}

// Updated props interface to match what's passed from RepositoryDetail
export interface FileExplorerProps {
  repositoryId: string;
  currentPath: string;
  onFileSelect: (file: FileNode) => void | Promise<void>;
  onFileUpload?: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  repositoryId,
  currentPath = '',
  onFileSelect,
  onFileUpload
}) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileNode } | null>(null);

  // Fetch files when component mounts or dependencies change
  useEffect(() => {
    fetchFiles();
  }, [repositoryId, currentPath]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the API to get file tree
      const result = await apiService.getFileTree(repositoryId, currentPath || null);
      
      if (result.success && result.data) {
        // Convert the backend response to FileNode[] format
        const fileNodes = result.data.nodes.map((node: any) => ({
          path: node.path,
          name: node.name,
          isFolder: node.isFolder,
          size: node.size || 0,
          lastModified: node.lastModified || Date.now(),
          children: node.children || []
        }));
        setFiles(fileNodes);
      } else {
        setError('Failed to load files: ' + apiService.getErrorMessage(result.error));
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading files');
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure from flat file list
  const buildTree = (files: FileNode[]): FileNode[] => {
    const tree: FileNode[] = [];
    const map: { [key: string]: FileNode } = {};

    // First pass: create all nodes
    files.forEach(file => {
      map[file.path] = { ...file, children: [] };
    });

    // Second pass: build tree structure
    files.forEach(file => {
      const parts = file.path.split('/');
      if (parts.length === 1) {
        // Root level file/folder
        tree.push(map[file.path]);
      } else {
        // Find parent and add as child
        const parentPath = parts.slice(0, -1).join('/');
        if (map[parentPath]) {
          map[parentPath].children?.push(map[file.path]);
        }
      }
    });

    return tree;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleItemClick = (item: FileNode, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedItem(item.path);
    
    if (item.isFolder) {
      toggleFolder(item.path);
      // Navigate to folder - typically would update currentPath
    } else {
      // Call the onFileSelect prop passed from parent
      onFileSelect(item);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, item: FileNode) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Handler for creating a new folder
  const handleCreateFolder = (parentPath: string) => {
    // For now, just log - this would open a modal in a real implementation
    console.log('Create folder in', parentPath);
    // You would typically implement a modal to get the folder name
  };

  // Handler for uploading files
  const handleUploadFile = (parentPath: string) => {
    console.log('Upload file to', parentPath);
    if (onFileUpload) {
      onFileUpload();
    }
    // You would typically implement a file upload dialog
  };

  // Handler for deleting items
  const handleDeleteItem = (path: string, isFolder: boolean) => {
    console.log('Delete', isFolder ? 'folder' : 'file', path);
    // Implement confirmation and deletion logic
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (item: FileNode): string => {
    if (item.isFolder) {
      return expandedFolders.has(item.path) ? '📂' : '📁';
    }
    
    const extension = item.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return '📜';
      case 'ts':
      case 'tsx':
        return '🔷';
      case 'mo':
        return '🔵';
      case 'rs':
        return '🦀';
      case 'py':
        return '🐍';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'html':
        return '🌐';
      case 'css':
      case 'scss':
        return '🎨';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return '🖼️';
      case 'svg':
        return '🎭';
      case 'pdf':
        return '📕';
      case 'zip':
      case 'tar':
      case 'gz':
        return '📦';
      default:
        return '📄';
    }
  };

  const renderTreeNode = (node: FileNode, level: number = 0): React.ReactElement => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedItem === node.path;

    return (
      <div key={node.path} className="file-tree-node">
        <div
          className={`file-tree-item ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 20 + 10}px` }}
          onClick={(e) => handleItemClick(node, e)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          <span className="file-icon">{getFileIcon(node)}</span>
          <span className="file-name">{node.name}</span>
          {!node.isFolder && (
            <span className="file-size">{formatFileSize(node.size)}</span>
          )}
        </div>
        
        {node.isFolder && isExpanded && node.children && (
          <div className="file-tree-children">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const treeData = buildTree(files);

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (loading && files.length === 0) {
    return <div className="file-explorer-loading">Loading files...</div>;
  }
  
  if (error && files.length === 0) {
    return <div className="file-explorer-error">{error}</div>;
  }

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <div className="file-explorer-actions">
          <button 
            className="btn-small"
            onClick={() => handleCreateFolder(currentPath)}
            title="New folder"
          >
            📁+ New Folder
          </button>
          <button 
            className="btn-small"
            onClick={() => handleUploadFile(currentPath)}
            title="Upload files"
          >
            📤 Upload Files
          </button>
        </div>
      </div>

      <div className="file-tree">
        {treeData.length === 0 ? (
          <div className="empty-folder">
            <p>This folder is empty</p>
            <button 
              className="btn-primary"
              onClick={() => handleUploadFile(currentPath)}
            >
              Upload files
            </button>
          </div>
        ) : (
          treeData.map(node => renderTreeNode(node))
        )}
      </div>

      {contextMenu && (
        <div 
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.item.isFolder ? (
            <>
              <div 
                className="context-menu-item"
                onClick={() => {
                  handleCreateFolder(contextMenu.item.path);
                  closeContextMenu();
                }}
              >
                📁 New Folder
              </div>
              <div 
                className="context-menu-item"
                onClick={() => {
                  handleUploadFile(contextMenu.item.path);
                  closeContextMenu();
                }}
              >
                📤 Upload Files
              </div>
              <hr />
            </>
          ) : null}
          <div 
            className="context-menu-item delete"
            onClick={() => {
              handleDeleteItem(contextMenu.item.path, contextMenu.item.isFolder);
              closeContextMenu();
            }}
          >
            🗑️ Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
