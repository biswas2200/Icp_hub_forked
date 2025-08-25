// Development configuration for when backend is not available
export const devConfig = {
  // Development mode flags
  DEV_MODE: true,
  MOCK_BACKEND: true,
  ENABLE_LOGGING: true,
  
  // Mock canister IDs for development
  BACKEND_CANISTER_ID: 'uxrrr-q7777-77774-qaaaq-cai',
  INTERNET_IDENTITY_CANISTER_ID: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  
  // Network configuration
  DFX_NETWORK: 'local',
  
  // Mock data settings
  MOCK_REPOSITORIES_COUNT: 5,
  MOCK_FILES_COUNT: 10,
  
  // Development features
  ENABLE_MOCK_UPLOADS: true,
  ENABLE_MOCK_SEARCH: true,
  ENABLE_MOCK_GOVERNANCE: true
}

export default devConfig

