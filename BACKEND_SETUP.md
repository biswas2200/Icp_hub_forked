# Backend Setup Guide

## Current Issue
The frontend is currently running in **mock mode** because the backend canisters are not deployed and running. This means:
- Files are not being loaded from the actual backend
- Uploads are simulated but not persisted
- All data is mock data for development purposes

## Prerequisites
1. **Install DFX (Internet Computer SDK)**
   ```bash
   # For Windows (using PowerShell)
   winget install dfinity.dfx
   
   # For macOS
   brew install dfinity/tap/dfx
   
   # For Linux
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. **Verify DFX installation**
   ```bash
   dfx --version
   ```

## Starting the Backend

1. **Navigate to project root**
   ```bash
   cd /path/to/Icp_hub
   ```

2. **Start local Internet Computer network**
   ```bash
   dfx start --background
   ```

3. **Deploy the backend canisters**
   ```bash
   dfx deploy
   ```

4. **Generate frontend types** (if needed)
   ```bash
   dfx generate
   ```

## Verifying Backend Status

1. **Check canister status**
   ```bash
   dfx canister status Icp_hub_backend
   ```

2. **Check network status**
   ```bash
   dfx status
   ```

3. **View canister logs**
   ```bash
   dfx canister call Icp_hub_backend health
   ```

## Frontend Development

1. **Start frontend development server**
   ```bash
   cd src/icp-hub-frontend
   npm run dev
   ```

2. **Check backend connection**
   - Look for the backend status indicator in the navigation
   - Green ✅ = Backend online
   - Yellow ⚠️ = Backend offline (mock mode)

## Environment Variables

The frontend will automatically detect the backend status. If you need to configure specific canister IDs:

1. **Create `.env.local` file in `src/icp-hub-frontend/`**
   ```env
   VITE_DFX_NETWORK=local
   VITE_BACKEND_CANISTER_ID=<your-canister-id>
   VITE_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
   ```

2. **Get canister ID from DFX**
   ```bash
   dfx canister id Icp_hub_backend
   ```

## Troubleshooting

### Backend won't start
- Ensure ports 8000 and 4943 are available
- Check if another DFX instance is running
- Restart DFX: `dfx stop && dfx start --background`

### Can't deploy canisters
- Ensure DFX is running: `dfx status`
- Check Motoko compilation: `dfx build`
- Verify dependencies: `mops install`

### Frontend can't connect
- Check browser console for errors
- Verify canister IDs in environment
- Ensure backend health check passes

## Mock Mode Features

When the backend is offline, the frontend provides:
- ✅ Mock repositories and files
- ✅ Simulated file uploads
- ✅ Mock search functionality
- ✅ Development UI testing

## Next Steps

Once the backend is running:
1. The status indicator will turn green
2. Real file operations will work
3. Uploads will be persisted
4. Search will query actual data

## Support

If you continue to have issues:
1. Check the DFX documentation: https://internetcomputer.org/docs/current/developer-docs/setup/install/
2. Review the project's `dfx.json` configuration
3. Check the backend Motoko code in `src/Icp_hub_backend/`

