import _Time "mo:base/Time";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter"; 
import Text "mo:base/Text";  
import Array "mo:base/Array";
import _Hash "mo:base/Hash";

module {
    // User Profile type
    public type UserProfile = {
        displayName: ?Text;
        bio: ?Text;
        avatar: ?Text;
        location: ?Text;
        website: ?Text;
        socialLinks: {
            twitter: ?Text;
            github: ?Text;
            linkedin: ?Text;
        };
    };

    public type UpdateUserProfileRequest = {
    displayName : ?Text;
    bio : ?Text;
    avatar : ?Text;
    location : ?Text;
    website : ?Text;
    socialLinks: {
            twitter: ?Text;
            github: ?Text;
            linkedin: ?Text;
        };
    };

    // System statistics type
    public type SystemStats = {
        totalUsers: Nat;
        totalRepositories: Nat;
        totalFiles: Nat;
        totalStorage: Nat;
    };

    // User type
    public type User = {
        principal: Principal;
        username: Text;
        email: ?Text;
        profile: UserProfile;
        repositories: [Text];
        createdAt: Int;
        updatedAt: Int;
    };

    public type BlockchainType = {
        #ICP;
        #Ethereum;
        #Solana;
        #Bitcoin;
        #Polygon;
        #Arbitrum;
        #BinanceSmartChain;
        #Avalanche;
        #Near;
        #Cosmos;
        #Polkadot;
    };

    public type SmartContractLanguage = {
        #Solidity;
        #Motoko;
        #Rust;
        #Vyper;
        #Cairo;
        #Clarity;
        #Michelson;
        #Move;
        #Plutus;
        #Wasm;
    };

    public type DependencySource = {
        #NPM;
        #Cargo;
        #Maven;
        #GitHub: { owner: Text; repo: Text; commit: Text };
        #IPFS: { cid: Text };
        #Vessel;
    };

     public type FileType = {
        #SmartContract: SmartContractInfo;
        #DeploymentConfig;
        #Frontend;
        #Backend;
        #Documentation;
        #Test;
        #Other;
    };

    public type Dependency = {
        name: Text;
        version: Text;
        source: DependencySource;
    };

    public type NetworkConfig = {
        #Mainnet;
        #Testnet: { name: Text };
        #Local: { rpcUrl: Text };
        #Custom: { chainId: Nat; rpcUrl: Text };
    };

    public type DeploymentConfig = {
        network: NetworkConfig;
        constructorArgs: ?Text;
        gasLimit: ?Nat;
        value: ?Nat;
        wallet: ?Text;
        gasPrice: ?Nat;
        confirmations: ?Nat;
        timeout: ?Nat;
    };

    public type ContractMetadata = {
        blockchain: BlockchainType;
        language: SmartContractLanguage;
        version: Text;
        compiler: ?Text;
        abi: ?Text;
        bytecode: ?Blob;
        sourceFiles: [Text];
        dependencies: [Dependency];
        deploymentConfig: ?DeploymentConfig;
        sourceMap: ?Text
    };

    public type SmartContractInfo = {
        language: Text;
        chain: BlockchainType;
        compiler: ?Text;
        version: ?Text;
    };

     public type ProjectType = {
        #DeFi;
        #NFT;
        #DAO;
        #Gaming;
        #Infrastructure;
        #CrossChain;
        #Other: Text;
    };

    public type DeploymentStatus = {
        #Pending;
        #InProgress;
        #Success;
        #Failed: { reason: Text };
        #Verified;
    };

    public type DeploymentArtifacts = {
        abi: ?Text;
        bytecode: ?Text;
        sourceMap: ?Text;
        metadata: ?Text;
    };

     public type GasSettings = {
        gasLimit: Nat;
        maxFeePerGas: ?Nat;
        maxPriorityFeePerGas: ?Nat;
    };

     public type ChainConfig = {
        rpcUrl: Text;
        chainId: Nat;
        explorerUrl: Text;
        nativeCurrency: { name: Text; symbol: Text; decimals: Nat };
        gasSettings: ?GasSettings;
        defaultAccount: ?Text;
        gasLimit: Nat;
        gasPrice: Nat;
        blockTime: Nat;
        confirmations: Nat;
    };

    public type DeploymentRecord = {
        id: Text;
        repositoryId: Text;
        commitId: Text;
        contractAddress: ?Text;
        transactionHash: ?Text;
        deployedAt: Int;
        deployedBy: Principal;
        status: DeploymentStatus;
        gasUsed: ?Nat;
        cost: ?Nat;
        artifacts: ?DeploymentArtifacts;
        chain: BlockchainType;
    };


    // Repository Settings type
    public type RepositorySettings = {
        defaultBranch: Text;
        allowForking: Bool;
        allowIssues: Bool;
        allowWiki: Bool;
        allowProjects: Bool;
        visibility: RepositoryVisibility;
        license: ?Text;
        topics: [Text];
    };

    // Repository visibility enum
    public type RepositoryVisibility = {
        #Public;
        #Private;
        #Internal;
    };

    // Collaborator permissions
    public type CollaboratorPermission = {
        #Read;
        #Write;
        #Admin;
        #Owner;
        #Deploy: [BlockchainType];
    };

    // Collaborator type
    public type Collaborator = {
        principal: Principal;
        permission: CollaboratorPermission;
        addedAt: Int;
        addedBy: Principal;
    };

    // File Entry type
    public type FileEntry = {
        path: Text;
        content: Blob;
        size: Nat;
        hash: Text; // SHA-256 hash
        version: Nat;
        lastModified: Int;
        author: Principal;
        commitMessage: ?Text;
        fileType: ?FileType;
        contractMetadata: ?ContractMetadata;
        targetChain: ?BlockchainType;
        isFolder: Bool;   
        mimeType: ?Text;   
        parentPath: ?Text;
    };

    // File tree structure for displaying hierarchy
    public type FileTreeNode = {
        path: Text;
        name: Text;
        isFolder: Bool;
        size: Nat;
        lastModified: Int;
        children: [FileTreeNode]; // Nested structure for folders
    };

    // Request type for creating folders
    public type CreateFolderRequest = {
        repositoryId: Text;
        folderPath: Text;
        folderName: Text;
    };

    // Response type for file tree
    public type FileTreeResponse = {
        repositoryId: Text;
        tree: [FileTreeNode];
        totalFiles: Nat;
        totalFolders: Nat;
        totalSize: Nat;
    };

    // Commit type for version control
    public type Commit = {
        id: Text;
        message: Text;
        author: Principal;
        timestamp: Int;
        parentCommits: [Text];
        changedFiles: [Text];
        hash: Text;
    };

    // Branch type
    public type Branch = {
        name: Text;
        commitId: Text;
        isDefault: Bool;
        createdAt: Int;
        createdBy: Principal;
    };

    // Repository type
    public type Repository = {
        id: Text;
        name: Text;
        description: ?Text;
        owner: Principal;
        collaborators: HashMap.HashMap<Principal, Collaborator>;
        isPrivate: Bool;
        settings: RepositorySettings;
        createdAt: Int;
        updatedAt: Int;
        files: HashMap.HashMap<Text, FileEntry>;
        commits: [Commit];
        branches: [Branch];
        stars: Nat;
        forks: Nat;
        language: ?Text;
        size: Nat; 
        supportedChains: [BlockchainType];
        deploymentTargets: [DeploymentTarget];
        chainConfigs: [(BlockchainType, ChainConfig)];
        lastDeployment: ?DeploymentRecord;
    };

    // Add this type definition
    public type SerializableRepository = {
        id: Text;
        name: Text;
        description: ?Text;
        owner: Principal;
        collaborators: [(Principal, Collaborator)];
        isPrivate: Bool;
        settings: RepositorySettings;
        createdAt: Int;
        updatedAt: Int;
        files: [(Text, FileEntry)]; 
        commits: [Commit];
        branches: [Branch];
        stars: Nat;
        forks: Nat;
        language: ?Text;
        size: Nat;
        supportedChains: [BlockchainType];
        deploymentTargets: [DeploymentTarget];
        chainConfigs: [(BlockchainType, ChainConfig)];
        lastDeployment: ?DeploymentRecord;
    };

    // API Response types
    public type Result<T, E> = {
        #Ok: T;
        #Err: E;
    };

    // Error types
    public type Error = {
        #NotFound: Text;
        #Unauthorized: Text;
        #BadRequest: Text;
        #InternalError: Text;
        #Conflict: Text;
        #Forbidden: Text;
    };

    // Repository creation request
    public type CreateRepositoryRequest = {
        name: Text;
        description: ?Text;
        isPrivate: Bool;
        initializeWithReadme: Bool;
        license: ?Text;
        gitignoreTemplate: ?Text;
        targetChains: [BlockchainType];
        projectType: ProjectType;
        autoDeployEnabled: Bool;
    };

    // File upload request
    public type UploadFileRequest = {
        repositoryId: Text;
        path: Text;
        content: Blob;
        commitMessage: Text;
        branch: ?Text;
    };

    // User registration request
    public type RegisterUserRequest = {
        username: Text;
        email: ?Text;
        profile: UserProfile;
    };

    // Repository update request
    public type UpdateRepositoryRequest = {
        description: ?Text;
        settings: ?RepositorySettings;
    };

    // Pagination for queries
    public type PaginationParams = {
        page: Nat;
        limit: Nat;
    };

    // Repository list response
    public type RepositoryListResponse = {
        repositories: [SerializableRepository];
        totalCount: Nat;
        hasMore: Bool;
    };

    // File list response
    public type FileListResponse = {
        files: [FileEntry];
        totalCount: Nat;
        path: Text;
    };

    // Memory stats for monitoring
    public type MemoryStats = {
        totalMemory: Nat;
        usedMemory: Nat;
        availableMemory: Nat;
        heapSize: Nat;
        cycles: Nat;
    };

    // Chain Fusion related types
    public type ChainType = {
        #Bitcoin;
        #Ethereum;
        #Solana;
        #ICP;
    };

    public type DeploymentTarget = {
        chain: BlockchainType;
        network: NetworkConfig;
        autoDeploy: Bool;
        config: DeploymentConfig;
    };

    // CI/CD Pipeline types
    public type PipelineStatus = {
        #Pending;
        #Running;
        #Success;
        #Failed;
        #Cancelled;
    };

    public type PipelineStep = {
        name: Text;
        status: PipelineStatus;
        startTime: ?Int;
        endTime: ?Int;
        logs: [Text];
    };

    public type Pipeline = {
        id: Text;
        repositoryId: Text;
        commitId: Text;
        status: PipelineStatus;
        steps: [PipelineStep];
        createdAt: Int;
        updatedAt: Int;
        deploymentTargets: [DeploymentTarget];
    };

    // Search Scope type
    public type SearchScope = {
        #All;
        #Repositories;
        #Users;
        #Files;
        #Code;
    };

    public type SortBy = {
        #Relevance;
        #Name;
        #CreatedAt;
        #UpdatedAt;
        #Stars;
        #Size;
    };

    public type SearchFilter = {
        owner: ?Principal;
        language: ?Text;
        isPrivate: ?Bool;
        minSize: ?Nat;
        maxSize: ?Nat;
        createdAfter: ?Int;
        createdBefore: ?Int;
    };

    public type SearchRequest = {
        searchQuery: Text;
        scope: SearchScope;
        filters: ?SearchFilter;
        pagination: ?PaginationParams;
        sortBy: ?SortBy;
    };

    // Original search result types 
    public type UserSearchResult = {
        user: User;
        score: Float;
        matchedFields: [Text];
    };

    public type RepositorySearchResult = {
        repository: Repository; 
        score: Float;
        matchedFields: [Text];
    };

    public type FileSearchResult = {
        file: FileEntry;
        repository: Repository;
        score: Float;
        matchedFields: [Text];
        snippets: [Text];
    };

    public type SearchResults = {
        repositories: [RepositorySearchResult];
        users: [UserSearchResult];
        files: [FileSearchResult]; 
        totalCount: Nat;
        hasMore: Bool;
        searchQuery: Text;
        scope: SearchScope;
    };

    // Combined search results type for internal use
    public type CombinedSearchResults = {
        repoResults: [RepositorySearchResult];
        userResults: [UserSearchResult];
        fileResults: [FileSearchResult];
    };

    // Utility functions for type conversions
    public func userToText(user: User): Text {
        user.username # " (" # Principal.toText(user.principal) # ")";
    };

    public func repositoryToText(repo: Repository): Text {
        repo.name # " - " # (switch (repo.description) {
            case null "No description";
            case (?desc) desc;
        });
    };

    public func errorToText(error: Error): Text {
        switch (error) {
            case (#NotFound(msg)) "Not Found: " # msg;
            case (#Unauthorized(msg)) "Unauthorized: " # msg;
            case (#BadRequest(msg)) "Bad Request: " # msg;
            case (#InternalError(msg)) "Internal Error: " # msg;
            case (#Conflict(msg)) "Conflict: " # msg;
            case (#Forbidden(msg)) "Forbidden: " # msg;
        };
    };

    public func repositoryToSerializable(repo: Repository): SerializableRepository {
        {
            id = repo.id;
            name = repo.name;
            description = repo.description;
            owner = repo.owner;
            collaborators = Iter.toArray(repo.collaborators.entries());
            isPrivate = repo.isPrivate;
            settings = repo.settings;
            createdAt = repo.createdAt;
            updatedAt = repo.updatedAt;
            files = Iter.toArray(repo.files.entries());
            commits = repo.commits;
            branches = repo.branches;
            stars = repo.stars;
            forks = repo.forks;
            language = repo.language;
            size = repo.size;
            supportedChains = repo.supportedChains;
            deploymentTargets = repo.deploymentTargets;
            chainConfigs = repo.chainConfigs;
            lastDeployment = repo.lastDeployment;
        }
    };

    public func serializableToRepository(serRepo: SerializableRepository): Repository {
        let fileMap = HashMap.HashMap<Text, FileEntry>(serRepo.files.size(), Text.equal, Text.hash);
        for ((path, file) in serRepo.files.vals()) {
            fileMap.put(path, file);
        };
        let collaboratorMap = HashMap.HashMap<Principal, Collaborator>(serRepo.collaborators.size(), Principal.equal, Principal.hash);
        for((principal, collab) in serRepo.collaborators.vals()) {
            collaboratorMap.put(principal, collab);
        };

        {
            id = serRepo.id;
            name = serRepo.name;
            description = serRepo.description;
            owner = serRepo.owner;
            collaborators = collaboratorMap;
            isPrivate = serRepo.isPrivate;
            settings = serRepo.settings;
            createdAt = serRepo.createdAt;
            updatedAt = serRepo.updatedAt;
            files = fileMap;
            commits = serRepo.commits;
            branches = serRepo.branches;
            stars = serRepo.stars;
            forks = serRepo.forks;
            language = serRepo.language;
            size = serRepo.size;
            supportedChains = serRepo.supportedChains;
            deploymentTargets = serRepo.deploymentTargets;
            chainConfigs = serRepo.chainConfigs;
            lastDeployment = serRepo.lastDeployment;
            
        }
    };

    // Add serializable versions of search result types
    public type SerializableSearchResults = {
        repositories: [SerializableRepositorySearchResult];
        users: [UserSearchResult]; 
        files: [SerializableFileSearchResult];
        totalCount: Nat;
        hasMore: Bool;
        searchQuery: Text;
        scope: SearchScope;
    };

    public type SerializableRepositorySearchResult = {
        repository: SerializableRepository;
        score: Float;
        matchedFields: [Text];
    };

    public type SerializableFileSearchResult = {
        file: FileEntry;
        repository: SerializableRepository;
        score: Float;
        matchedFields: [Text];
        snippets: [Text];
    };

    // conversion functions
    public func repositorySearchResultToSerializable(result: RepositorySearchResult): SerializableRepositorySearchResult {
        {
            repository = repositoryToSerializable(result.repository);
            score = result.score;
            matchedFields = result.matchedFields;
        }
    };

    public func fileSearchResultToSerializable(result: FileSearchResult): SerializableFileSearchResult {
        {
            file = result.file;
            repository = repositoryToSerializable(result.repository);
            score = result.score;
            matchedFields = result.matchedFields;
            snippets = result.snippets;
        }
    };

    public func searchResultsToSerializable(results: SearchResults): SerializableSearchResults {
        {
            repositories = Array.map<RepositorySearchResult, SerializableRepositorySearchResult>(
                results.repositories, repositorySearchResultToSerializable
            );
            users = results.users;
            files = Array.map<FileSearchResult, SerializableFileSearchResult>(
                results.files, fileSearchResultToSerializable
            );
            totalCount = results.totalCount;
            hasMore = results.hasMore;
            searchQuery = results.searchQuery;
            scope = results.scope;
        }
    };
    
}
