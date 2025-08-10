# ICP Hub Frontend

A modern React-based frontend application for the ICP Hub platform, built with TypeScript and Vite.

## 🚀 Features

- **React 19**: Latest React features with hooks and modern patterns
- **TypeScript**: Full type safety and better development experience
- **Vite**: Fast build tool and development server
- **Modern UI Components**: Built-in components for governance, repositories, and user management
- **Wallet Integration**: Internet Computer wallet connection capabilities
- **Responsive Design**: Mobile-first approach with modern CSS

## 📁 Project Structure

```
src/icp-hub-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── CreateProposalModal.tsx
│   │   ├── Documentation.tsx
│   │   ├── Governance.tsx
│   │   ├── NewRepositoryModal.tsx
│   │   ├── PageLayout.tsx
│   │   ├── ProfileModal.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── Repositories.tsx
│   │   ├── RepositoryDetail.tsx
│   │   ├── Sidebar.tsx
│   │   └── WalletConnectionModal.tsx
│   ├── services/            # API and service layer
│   │   ├── api.ts
│   │   ├── apiService.ts
│   │   ├── governanceService.ts
│   │   ├── repositoryService.ts
│   │   └── walletService.tsx
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts
│   │   └── repository.ts
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── dist/                    # Build output
└── package.json             # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd src/icp-hub-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build the project for production
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run preview`** - Preview the production build locally

## 🏗️ Build and Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be available in the `dist/` directory.

## 🔧 Configuration

### TypeScript Configuration
- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - Application-specific TypeScript settings
- `tsconfig.node.json` - Node.js environment TypeScript settings

### Vite Configuration
- `vite.config.ts` - Vite build tool configuration
- `index.html` - HTML entry point

### ESLint Configuration
- `eslint.config.js` - Code quality and style rules

## 📱 Components Overview

### Core Components
- **PageLayout**: Main application layout with sidebar navigation
- **Sidebar**: Navigation sidebar with menu items
- **WalletConnectionModal**: Internet Computer wallet connection interface

### Feature Components
- **Governance**: Proposal creation and voting interface
- **Repositories**: Repository management and listing
- **ProfilePage**: User profile and settings
- **Documentation**: Help and documentation interface

### Modal Components
- **CreateProposalModal**: New governance proposal creation
- **NewRepositoryModal**: Repository creation interface
- **ProfileModal**: Profile editing modal

## 🔌 Services

### API Services
- **apiService**: Base HTTP client and API utilities
- **governanceService**: Governance-related API calls
- **repositoryService**: Repository management API calls
- **walletService**: Wallet connection and management

## 🎨 Styling

The application uses CSS modules and component-specific stylesheets:
- Each component has its own `.css` file
- Global styles are defined in `src/index.css`
- Responsive design with mobile-first approach

## 🧪 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Maintain consistent naming conventions

### Component Structure
- Keep components focused and single-responsibility
- Use TypeScript interfaces for props and state
- Implement proper error handling and loading states

### State Management
- Use React hooks for local state
- Implement proper data fetching patterns
- Handle loading and error states gracefully

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Serve Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Update this README for significant changes
4. Test your changes thoroughly

## 📄 License

This project is part of the ICP Hub platform. See the main project LICENSE file for details.

## 🔗 Related Links

- [ICP Hub Backend](../Icp_hub_backend/)
- [Project Documentation](../../README.md)
- [Internet Computer Documentation](https://internetcomputer.org/docs) 