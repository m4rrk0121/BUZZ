// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title MultiTokenLock
 * @dev A contract for locking different ERC20 tokens for specified durations.
 * Users can lock any ERC20 token and withdraw them after the lock period expires.
 */
contract MultiTokenLock is ReentrancyGuard, Ownable2Step {
    using SafeERC20 for IERC20;

    // Structure for lock information
    struct Lock {
        address tokenAddress;      // Address of the ERC20 token being locked
        uint256 amount;            // Amount of tokens locked
        uint256 unlockTime;        // Timestamp when tokens can be withdrawn
        bool withdrawn;            // Whether the tokens have been withdrawn
        string purpose;            // Optional note about the purpose of the lock
    }

    // Mapping from user address to their locks
    mapping(address => Lock[]) private userLocks;
    
    // Total locked tokens by token address
    mapping(address => uint256) public totalLockedTokens;
    
    // Events
    event TokensLocked(address indexed user, address indexed tokenAddress, uint256 amount, uint256 unlockTime, uint256 lockId);
    event TokensWithdrawn(address indexed user, address indexed tokenAddress, uint256 amount, uint256 lockId);
    event LockExtended(address indexed user, uint256 lockId, uint256 newUnlockTime);
    event EmergencyWithdraw(address indexed tokenAddress, address indexed recipient, uint256 amount);
    event GlobalIndexingUpdated(address indexed user, uint256 lockId, uint256 globalIndex);

    // Minimum and maximum lock durations
    uint256 public constant MIN_LOCK_DURATION = 15 minutes; // 15 minutes
    uint256 public constant MAX_LOCK_DURATION = 10 * 365 days; // 10 years

    // Maximum number of locks to process in a single transaction
    uint256 public constant MAX_PAGINATION_LIMIT = 100;

    /**
     * @dev Constructor that initializes the contract with the deployer as the owner
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Lock tokens for a specified duration
     * @param tokenAddress Address of the ERC20 token
     * @param amount Amount of tokens to lock
     * @param lockDuration Duration in seconds to lock the tokens
     * @param purpose Optional note about the purpose of the lock
     */
    function lockTokens(
        address tokenAddress,
        uint256 amount,
        uint256 lockDuration,
        string memory purpose
    ) external nonReentrant {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(lockDuration >= MIN_LOCK_DURATION, "Lock duration too short");
        require(lockDuration <= MAX_LOCK_DURATION, "Lock duration too long");

        // Calculate unlock time
        uint256 unlockTime = block.timestamp + lockDuration;

        // Transfer tokens from user to contract - requires prior approval
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);

        // Create a new lock
        userLocks[msg.sender].push(Lock({
            tokenAddress: tokenAddress,
            amount: amount,
            unlockTime: unlockTime,
            withdrawn: false,
            purpose: purpose
        }));

        // Update total locked amount
        totalLockedTokens[tokenAddress] += amount;

        // Get the lock ID (array index)
        uint256 lockId = userLocks[msg.sender].length - 1;
        
        // Store reference to this lock globally
        _storeLockReference(msg.sender, lockId);

        // Emit event with the lock ID
        emit TokensLocked(msg.sender, tokenAddress, amount, unlockTime, lockId);
    }

    /**
     * @dev Withdraw tokens after lock period has expired
     * @param lockId ID of the lock (index in the user's locks array)
     */
    function withdrawTokens(uint256 lockId) external nonReentrant {
        require(lockId < userLocks[msg.sender].length, "Invalid lock ID");
        
        Lock storage userLock = userLocks[msg.sender][lockId];
        
        require(!userLock.withdrawn, "Tokens already withdrawn");
        require(block.timestamp >= userLock.unlockTime, "Lock period not expired");
        
        // Mark as withdrawn first (reentrancy protection)
        userLock.withdrawn = true;
        
        // Update total locked amount
        totalLockedTokens[userLock.tokenAddress] -= userLock.amount;
        
        // Transfer tokens back to user - removed try/catch
        IERC20(userLock.tokenAddress).safeTransfer(msg.sender, userLock.amount);
        
        emit TokensWithdrawn(msg.sender, userLock.tokenAddress, userLock.amount, lockId);
    }

    /**
     * @dev Extend the lock period for an existing lock
     * @param lockId ID of the lock (index in the user's locks array)
     * @param extensionDuration Additional time to add to the lock
     */
    function extendLock(uint256 lockId, uint256 extensionDuration) external nonReentrant {
        require(lockId < userLocks[msg.sender].length, "Invalid lock ID");
        require(extensionDuration > 0, "Extension must be greater than 0");
        
        Lock storage userLock = userLocks[msg.sender][lockId];
        
        require(!userLock.withdrawn, "Tokens already withdrawn");
        
        // Calculate new unlock time
        uint256 newUnlockTime = userLock.unlockTime + extensionDuration;
        
        // Ensure the new unlock time doesn't exceed the maximum
        require(newUnlockTime - block.timestamp <= MAX_LOCK_DURATION, "Extended lock duration too long");
        
        userLock.unlockTime = newUnlockTime;
        
        emit LockExtended(msg.sender, lockId, newUnlockTime);
    }

    /**
     * @dev Get all locks for a specific user
     * @param user Address of the user
     * @return Array of locks for the user
     */
    function getUserLocks(address user) external view returns (Lock[] memory) {
        return userLocks[user];
    }

    /**
     * @dev Get the number of locks for a specific user
     * @param user Address of the user
     * @return Number of locks
     */
    function getUserLockCount(address user) external view returns (uint256) {
        return userLocks[user].length;
    }

    /**
     * @dev Get a specific lock by ID for a user
     * @param user Address of the user
     * @param lockId ID of the lock
     * @return tokenAddress Address of the locked token
     * @return amount Amount of tokens locked
     * @return unlockTime Timestamp when tokens can be withdrawn
     * @return withdrawn Whether the tokens have been withdrawn
     * @return purpose Optional note about the purpose of the lock
     */
    function getLockById(address user, uint256 lockId) external view returns (
        address tokenAddress,
        uint256 amount,
        uint256 unlockTime,
        bool withdrawn,
        string memory purpose
    ) {
        require(lockId < userLocks[user].length, "Invalid lock ID");
        
        Lock storage userLock = userLocks[user][lockId];
        
        return (
            userLock.tokenAddress,
            userLock.amount,
            userLock.unlockTime,
            userLock.withdrawn,
            userLock.purpose
        );
    }
    
    /**
     * @dev Emergency function to allow the contract owner to withdraw any tokens accidentally sent to the contract
     * @param tokenAddress Address of the token to withdraw
     * @param recipient Address to receive the tokens
     * @param amount Amount of tokens to withdraw
     */
    function emergencyWithdraw(address tokenAddress, address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(tokenAddress != address(0), "Invalid token address");
        
        // Ensure we're not withdrawing locked tokens
        uint256 contractBalance = IERC20(tokenAddress).balanceOf(address(this));
        uint256 availableBalance = contractBalance - totalLockedTokens[tokenAddress];
        require(amount <= availableBalance, "Cannot withdraw locked tokens");
        
        IERC20(tokenAddress).safeTransfer(recipient, amount);
        emit EmergencyWithdraw(tokenAddress, recipient, amount);
    }

    // Track all lock IDs for easy access
    mapping(uint256 => address) public lockIdToOwner;
    uint256 public totalLockCount;

    // Mapping from global index to user's local lock index
    mapping(uint256 => uint256) private userLockIndexByGlobalIndex;

    // Get paginated locks for frontend display
    function getAllLocksPaginated(uint256 start, uint256 limit) external view returns (
        address[] memory owners,
        address[] memory tokenAddresses,
        uint256[] memory amounts,
        uint256[] memory unlockTimes,
        uint256[] memory lockIds,
        bool[] memory withdrawnStates,
        string[] memory purposes
    ) {
        // Limit the number of locks to process
        require(limit <= MAX_PAGINATION_LIMIT, "Limit exceeds maximum");
        
        // Calculate end index with bounds checking
        uint256 end = start + limit;
        if (end > totalLockCount) {
            end = totalLockCount;
        }
        
        // Size of the result set
        uint256 resultSize = end - start;
        
        // Initialize return arrays
        owners = new address[](resultSize);
        tokenAddresses = new address[](resultSize);
        amounts = new uint256[](resultSize);
        unlockTimes = new uint256[](resultSize);
        lockIds = new uint256[](resultSize);
        withdrawnStates = new bool[](resultSize);
        purposes = new string[](resultSize);
        
        // Populate the arrays with additional bounds checking
        for (uint256 i = 0; i < resultSize; i++) {
            uint256 globalIndex = start + i;
            address owner = lockIdToOwner[globalIndex];
            
            // Make sure owner is valid
            if (owner == address(0)) continue;
            
            // Get the user's lock index from the global index
            uint256 userLockIndex = userLockIndexByGlobalIndex[globalIndex];
            
            // Ensure the user's lock index is valid
            if (userLockIndex >= userLocks[owner].length) continue;
            
            Lock storage userLock = userLocks[owner][userLockIndex];
            
            owners[i] = owner;
            tokenAddresses[i] = userLock.tokenAddress;
            amounts[i] = userLock.amount;
            unlockTimes[i] = userLock.unlockTime;
            lockIds[i] = userLockIndex;
            withdrawnStates[i] = userLock.withdrawn;
            purposes[i] = userLock.purpose;
        }
        
        return (owners, tokenAddresses, amounts, unlockTimes, lockIds, withdrawnStates, purposes);
    }

    // Get total number of locks for pagination
    function getTotalLockCount() external view returns (uint256) {
        return totalLockCount;
    }
    
    /**
     * @dev Store a reference to a user's lock in the global index
     * @param user Address of the user
     * @param lockId ID of the lock (index in the user's locks array)
     */
    function _storeLockReference(address user, uint256 lockId) internal {
        // Store the user's address for this global lock index
        lockIdToOwner[totalLockCount] = user;
        
        // Store the mapping from global index to user's local lock index
        userLockIndexByGlobalIndex[totalLockCount] = lockId;
        
        // Emit an event for this indexing update
        emit GlobalIndexingUpdated(user, lockId, totalLockCount);
        
        // Increment the total lock count
        totalLockCount++;
    }
}