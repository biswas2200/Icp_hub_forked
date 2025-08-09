
import { useState } from 'react'
import PageLayout from './PageLayout'
import './Documentation.css'

type DocSection = 'setup' | 'frontend' | 'backend' | 'dfx' | 'api' | 'deployment' | 'troubleshooting'

interface DocItem {
  id: DocSection
  title: string
  icon: string
  description: string
}

const docSections: DocItem[] = [
  {
    id: 'setup',
    title: 'Setup Guide',
    icon: '🚀',
    description: 'Get started with OpenKeyHub'
  },
  {
    id: 'frontend',
    title: 'Frontend',
    icon: '⚛️',
    description: 'React frontend development'
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: '🔧',
    description: 'ICP canister development'
  },
  {
    id: 'dfx',
    title: 'DFX Configuration',
    icon: '⚡',
    description: 'Internet Computer SDK setup'
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: '📚',
    description: 'API endpoints and usage'
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: '🚀',
    description: 'Deploy to production'
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: '🔍',
    description: 'Common issues and solutions'
  }
]

function Documentation() {
  const [activeSection, setActiveSection] = useState<DocSection>('setup')

  const renderContent = () => {
    switch (activeSection) {
      case 'setup':
        return (
          <div className="content-section">
            <h2 className="content-title">🚀 Getting Started with OpenKeyHub</h2>
            <p className="content-description">
              OpenKeyHub is a comprehensive multichain development platform built on the Internet Computer Protocol (ICP).
              This guide will help you set up and run OpenKeyHub locally.
            </p>
            
            <div className="prerequisites-section">
              <h3 className="section-title">📋 Prerequisites</h3>
              <ul className="prerequisites-list">
                <li><strong>Node.js</strong> (v18 or higher)</li>
                <li><strong>npm</strong> or <strong>yarn</strong></li>
                <li><strong>DFX</strong> (Internet Computer SDK)</li>
                <li><strong>Git</strong></li>
                <li><strong>Plug Wallet</strong> browser extension</li>
                <li><strong>Modern browser</strong> (Chrome, Firefox, Safari, Edge)</li>
              </ul>
            </div>

            <div className="installation-section">
              <h3 className="section-title">📦 Installation Steps</h3>
              
              <div className="installation-step">
                <h4 className="step-title">1. Clone the Repository</h4>
                <pre className="code-block"><code>git clone https://github.com/your-org/icp-hub.git
cd icp-hub</code></pre>
              </div>

              <div className="installation-step">
                <h4 className="step-title">2. Install DFX</h4>
                <pre className="code-block"><code># macOS/Linux
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Windows (using PowerShell)
powershell -c "irm https://internetcomputer.org/install.ps1 | iex"</code></pre>
              </div>

              <div className="installation-step">
                <h4 className="step-title">3. Verify DFX Installation</h4>
                <pre className="code-block"><code>dfx --version</code></pre>
              </div>

              <div className="installation-step">
                <h4 className="step-title">4. Start Local Internet Computer</h4>
                <pre className="code-block"><code>dfx start --background</code></pre>
              </div>

              <div className="installation-step">
                <h4 className="step-title">5. Deploy Canisters</h4>
                <pre className="code-block"><code>dfx deploy</code></pre>
              </div>

              <div className="installation-step">
                <h4 className="step-title">6. Install Frontend Dependencies</h4>
                <pre className="code-block"><code>cd src/icp-hub-frontend
npm install</code></pre>
              </div>

              <div className="installation-step">
                <h4 className="step-title">7. Start Development Server</h4>
                <pre className="code-block"><code>npm run dev</code></pre>
              </div>
            </div>

            <div className="next-steps-section">
              <h3 className="section-title">🎯 Next Steps</h3>
              <div className="next-steps-grid">
                <div className="next-step-card">
                  <h4>Connect Wallet</h4>
                  <p>Install Plug Wallet and connect to start using OpenKeyHub</p>
                </div>
                <div className="next-step-card">
                  <h4>Create Repository</h4>
                  <p>Set up your first multichain repository</p>
                </div>
                <div className="next-step-card">
                  <h4>Explore Features</h4>
                  <p>Discover governance, collaboration, and deployment tools</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'frontend':
        return (
          <div className="content-section">
            <h2 className="content-title">⚛️ Frontend Development</h2>
            <p className="content-description">
              The OpenKeyHub frontend is built with React, TypeScript, and Vite. Learn how to develop and customize the user interface.
            </p>

            <div className="tech-stack-section">
              <h3 className="section-title">🛠️ Technology Stack</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <span className="tech-icon">⚛️</span>
                  <span className="tech-name">React 18</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">📘</span>
                  <span className="tech-name">TypeScript</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">⚡</span>
                  <span className="tech-name">Vite</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🎨</span>
                  <span className="tech-name">CSS Modules</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🔗</span>
                  <span className="tech-name">Web3 Integration</span>
                </div>
              </div>
            </div>

            <div className="project-structure-section">
              <h3 className="section-title">📁 Project Structure</h3>
              <pre className="code-block"><code>src/icp-hub-frontend/
├── src/
│   ├── components/          # React components
│   ├── services/           # API and wallet services
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Public assets
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration</code></pre>
            </div>

            <div className="development-section">
              <h3 className="section-title">💻 Development Commands</h3>
              <div className="command-grid">
                <div className="command-item">
                  <h4>Start Development Server</h4>
                  <pre className="code-block"><code>npm run dev</code></pre>
                </div>
                <div className="command-item">
                  <h4>Build for Production</h4>
                  <pre className="code-block"><code>npm run build</code></pre>
                </div>
                <div className="command-item">
                  <h4>Preview Production Build</h4>
                  <pre className="code-block"><code>npm run preview</code></pre>
                </div>
                <div className="command-item">
                  <h4>Run Linting</h4>
                  <pre className="code-block"><code>npm run lint</code></pre>
                </div>
              </div>
            </div>
          </div>
        )

      case 'backend':
        return (
          <div className="content-section">
            <h2 className="content-title">🔧 Backend Development</h2>
            <p className="content-description">
              OpenKeyHub backend is built on the Internet Computer using Motoko programming language. Learn about canister development and deployment.
            </p>

            <div className="canisters-section">
              <h3 className="section-title">🏗️ Canister Architecture</h3>
              <div className="canister-grid">
                <div className="canister-card">
                  <h4>Auth Canister</h4>
                  <p>Handles user authentication and authorization</p>
                  <span className="canister-path">canisters/auth/</span>
                </div>
                <div className="canister-card">
                  <h4>Backend Canister</h4>
                  <p>Main application logic and data management</p>
                  <span className="canister-path">canisters/backend/</span>
                </div>
                <div className="canister-card">
                  <h4>Storage Canister</h4>
                  <p>File storage and IPFS integration</p>
                  <span className="canister-path">canisters/storage/</span>
                </div>
                <div className="canister-card">
                  <h4>Chain Fusion</h4>
                  <p>Cross-chain integration and operations</p>
                  <span className="canister-path">canisters/chain_fusion/</span>
                </div>
              </div>
            </div>

            <div className="motoko-section">
              <h3 className="section-title">🦀 Motoko Development</h3>
              <p>OpenKeyHub uses Motoko, a modern programming language designed for the Internet Computer.</p>
              
                             <div className="example-section">
                 <h4>Example: Repository Management</h4>
                 <pre className="code-block"><code>{`actor RepositoryManager {
  private stable var repositories: [Repository] = [];
  
  public shared({caller}) func createRepository(
    name: Text, 
    description: Text
  ) : async Result.Result<Repository, Error> {
    // Implementation here
  };
  
  public query func getRepositories() : async [Repository] {
    return repositories;
  };
}`}</code></pre>
               </div>
            </div>

            <div className="deployment-section">
              <h3 className="section-title">🚀 Canister Deployment</h3>
              <div className="deployment-steps">
                <div className="deployment-step">
                  <h4>1. Build Canisters</h4>
                  <pre className="code-block"><code>dfx build</code></pre>
                </div>
                <div className="deployment-step">
                  <h4>2. Deploy to Local Network</h4>
                  <pre className="code-block"><code>dfx deploy</code></pre>
                </div>
                <div className="deployment-step">
                  <h4>3. Deploy to Mainnet</h4>
                  <pre className="code-block"><code>dfx deploy --network ic</code></pre>
                </div>
              </div>
            </div>
          </div>
        )

      case 'dfx':
        return (
          <div className="content-section">
            <h2 className="content-title">⚡ DFX Configuration</h2>
            <p className="content-description">
              DFX (Decentralized Finance eXperience) is the Internet Computer SDK. Learn how to configure and use DFX for OpenKeyHub development.
            </p>

            <div className="dfx-config-section">
              <h3 className="section-title">⚙️ DFX Configuration</h3>
              <p>The <code>dfx.json</code> file configures your Internet Computer project:</p>
              
                             <pre className="code-block"><code>{`{
  "canisters": {
    "auth": {
      "type": "motoko",
      "source": ["canisters/auth/src"]
    },
    "backend": {
      "type": "motoko", 
      "source": ["canisters/backend/src"]
    },
    "storage": {
      "type": "motoko",
      "source": ["canisters/storage/src"]
    },
    "chain_fusion": {
      "type": "motoko",
      "source": ["canisters/chain_fusion/src"]
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    }
  }
}`}</code></pre>
            </div>

            <div className="dfx-commands-section">
              <h3 className="section-title">🔧 DFX Commands</h3>
              <div className="command-grid">
                <div className="command-item">
                  <h4>Start Local Network</h4>
                  <pre className="code-block"><code>dfx start --background</code></pre>
                </div>
                <div className="command-item">
                  <h4>Stop Local Network</h4>
                  <pre className="code-block"><code>dfx stop</code></pre>
                </div>
                <div className="command-item">
                  <h4>Build Canisters</h4>
                  <pre className="code-block"><code>dfx build</code></pre>
                </div>
                <div className="command-item">
                  <h4>Deploy Canisters</h4>
                  <pre className="code-block"><code>dfx deploy</code></pre>
                </div>
                <div className="command-item">
                  <h4>Generate Types</h4>
                  <pre className="code-block"><code>dfx generate</code></pre>
                </div>
                <div className="command-item">
                  <h4>Check Status</h4>
                  <pre className="code-block"><code>dfx ping</code></pre>
                </div>
              </div>
            </div>

            <div className="identity-section">
              <h3 className="section-title">🆔 Identity Management</h3>
              <p>DFX manages identities for interacting with the Internet Computer:</p>
              
              <div className="identity-commands">
                <div className="identity-command">
                  <h4>Create New Identity</h4>
                  <pre className="code-block"><code>dfx identity new my-identity</code></pre>
                </div>
                <div className="identity-command">
                  <h4>List Identities</h4>
                  <pre className="code-block"><code>dfx identity list</code></pre>
                </div>
                <div className="identity-command">
                  <h4>Use Identity</h4>
                  <pre className="code-block"><code>dfx identity use my-identity</code></pre>
                </div>
                <div className="identity-command">
                  <h4>Get Principal</h4>
                  <pre className="code-block"><code>dfx identity get-principal</code></pre>
                </div>
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="content-section">
            <h2 className="content-title">📚 API Reference</h2>
            <p className="content-description">
              Complete API documentation for OpenKeyHub backend services and frontend integration.
            </p>

            <div className="api-endpoints-section">
              <h3 className="section-title">🔗 API Endpoints</h3>
              
              <div className="endpoint-group">
                <h4>Repository Management</h4>
                <div className="endpoint-item">
                  <span className="method get">GET</span>
                  <span className="path">/repositories</span>
                  <span className="description">List all repositories</span>
                </div>
                <div className="endpoint-item">
                  <span className="method post">POST</span>
                  <span className="path">/repositories</span>
                  <span className="description">Create new repository</span>
                </div>
                <div className="endpoint-item">
                  <span className="method get">GET</span>
                  <span className="path">/repositories/:id</span>
                  <span className="description">Get repository details</span>
                </div>
              </div>

              <div className="endpoint-group">
                <h4>Governance</h4>
                <div className="endpoint-item">
                  <span className="method get">GET</span>
                  <span className="path">/proposals</span>
                  <span className="description">List governance proposals</span>
                </div>
                <div className="endpoint-item">
                  <span className="method post">POST</span>
                  <span className="path">/proposals</span>
                  <span className="description">Create new proposal</span>
                </div>
                <div className="endpoint-item">
                  <span className="method post">POST</span>
                  <span className="path">/proposals/:id/vote</span>
                  <span className="description">Vote on proposal</span>
                </div>
              </div>

              <div className="endpoint-group">
                <h4>Authentication</h4>
                <div className="endpoint-item">
                  <span className="method post">POST</span>
                  <span className="path">/auth/connect</span>
                  <span className="description">Connect wallet</span>
                </div>
                <div className="endpoint-item">
                  <span className="method post">POST</span>
                  <span className="path">/auth/disconnect</span>
                  <span className="description">Disconnect wallet</span>
                </div>
              </div>
            </div>

            <div className="api-usage-section">
              <h3 className="section-title">💡 Usage Examples</h3>
              
              <div className="example-section">
                <h4>Frontend API Integration</h4>
                                 <pre className="code-block"><code>{`import { apiService } from './services/apiService'

// Get repositories
const repositories = await apiService.get('/repositories')

// Create repository
const newRepo = await apiService.post('/repositories', {
  name: 'my-project',
  description: 'A new repository',
  visibility: 'public'
})

// Vote on proposal
await apiService.post(\`/proposals/\${proposalId}/vote\`, {
  vote: 'yes',
  weight: 100
})`}</code></pre>
              </div>
            </div>
          </div>
        )

      case 'deployment':
        return (
          <div className="content-section">
            <h2 className="content-title">🚀 Deployment Guide</h2>
            <p className="content-description">
              Learn how to deploy OpenKeyHub to production on the Internet Computer mainnet.
            </p>

            <div className="deployment-steps-section">
              <h3 className="section-title">📋 Deployment Steps</h3>
              
              <div className="deployment-step">
                <h4>1. Prepare for Production</h4>
                <pre className="code-block"><code># Build frontend
cd src/icp-hub-frontend
npm run build

# Build canisters
cd ../..
dfx build --network ic</code></pre>
              </div>

              <div className="deployment-step">
                <h4>2. Configure Environment</h4>
                <pre className="code-block"><code># Set network to mainnet
dfx config networks.ic.url https://ic0.app

# Create production identity
dfx identity new production</code></pre>
              </div>

              <div className="deployment-step">
                <h4>3. Deploy Canisters</h4>
                <pre className="code-block"><code># Deploy all canisters
dfx deploy --network ic

# Or deploy individually
dfx deploy auth --network ic
dfx deploy backend --network ic
dfx deploy storage --network ic
dfx deploy chain_fusion --network ic</code></pre>
              </div>

              <div className="deployment-step">
                <h4>4. Update Frontend Configuration</h4>
                <pre className="code-block"><code># Update canister IDs in frontend
VITE_BACKEND_CANISTER_ID=your_backend_canister_id
VITE_AUTH_CANISTER_ID=your_auth_canister_id
VITE_STORAGE_CANISTER_ID=your_storage_canister_id</code></pre>
              </div>
            </div>

            <div className="production-considerations">
              <h3 className="section-title">⚠️ Production Considerations</h3>
              <ul className="considerations-list">
                <li><strong>Cycles Management:</strong> Monitor and top up canister cycles</li>
                <li><strong>Security:</strong> Review access controls and permissions</li>
                <li><strong>Monitoring:</strong> Set up logging and error tracking</li>
                <li><strong>Backup:</strong> Implement data backup strategies</li>
                <li><strong>Performance:</strong> Optimize canister performance</li>
              </ul>
            </div>
          </div>
        )

      case 'troubleshooting':
        return (
          <div className="content-section">
            <h2 className="content-title">🔍 Troubleshooting</h2>
            <p className="content-description">
              Common issues and solutions for OpenKeyHub development and deployment.
            </p>

            <div className="troubleshooting-section">
              <h3 className="section-title">🚨 Common Issues</h3>
              
              <div className="issue-item">
                <h4>DFX Network Connection Issues</h4>
                <p><strong>Problem:</strong> Cannot connect to local or mainnet network</p>
                <p><strong>Solution:</strong></p>
                <pre className="code-block"><code># Check network status
dfx ping

# Restart local network
dfx stop
dfx start --background

# Check network configuration
dfx config networks</code></pre>
              </div>

              <div className="issue-item">
                <h4>Canister Deployment Fails</h4>
                <p><strong>Problem:</strong> Canisters fail to deploy</p>
                <p><strong>Solution:</strong></p>
                <pre className="code-block"><code># Check canister status
dfx canister status

# Clean and rebuild
dfx clean
dfx build
dfx deploy</code></pre>
              </div>

              <div className="issue-item">
                <h4>Frontend Build Errors</h4>
                <p><strong>Problem:</strong> TypeScript compilation errors</p>
                <p><strong>Solution:</strong></p>
                <pre className="code-block"><code># Install dependencies
npm install

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build</code></pre>
              </div>

              <div className="issue-item">
                <h4>Wallet Connection Issues</h4>
                <p><strong>Problem:</strong> Cannot connect to wallet</p>
                <p><strong>Solution:</strong></p>
                <ul>
                  <li>Ensure Plug Wallet extension is installed</li>
                  <li>Check browser console for errors</li>
                  <li>Verify network configuration</li>
                  <li>Try refreshing the page</li>
                </ul>
              </div>
            </div>

            <div className="support-section">
              <h3 className="section-title">💬 Getting Help</h3>
              <div className="support-options">
                <div className="support-option">
                  <h4>📖 Documentation</h4>
                  <p>Check the official Internet Computer documentation</p>
                </div>
                <div className="support-option">
                  <h4>🐛 GitHub Issues</h4>
                  <p>Report bugs and request features on GitHub</p>
                </div>
                <div className="support-option">
                  <h4>💬 Community</h4>
                  <p>Join the Internet Computer community forums</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Content not found</div>
    }
  }

  return (
    <PageLayout fullWidth>
      <div className="documentation-page">
        <div className="documentation-header">
          <h1 className="documentation-title">📖 OpenKeyHub Documentation</h1>
          <p className="documentation-subtitle">Complete guide to setting up and running OpenKeyHub</p>
        </div>

        <div className="documentation-container">
          <nav className="documentation-sidebar">
            {docSections.map((section) => (
              <button
                key={section.id}
                className={`doc-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                title={section.description}
              >
                <span className="doc-nav-icon">{section.icon}</span>
                <span className="doc-nav-text">{section.title}</span>
              </button>
            ))}
          </nav>

          <main className="documentation-content">
            <div className="documentation-main">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  )
}

export default Documentation 