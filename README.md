# MultiTokenLock Smart Contract

A contract for locking different ERC20 tokens for specified durations. Users can lock any ERC20 token and withdraw them after the lock period expires.

## Features

- Lock multiple ERC20 tokens
- Set custom lock durations
- Extend lock periods
- View lock information
- Emergency withdrawal functionality for contract owner

## Prerequisites

- Node.js >= 16.0.0
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your private key for deployment:
   ```
   PRIVATE_KEY=your_private_key_here
   BASESCAN_API_KEY=your_basescan_api_key_here
   
   # Optional: Custom RPC URLs
   # BASE_MAINNET_URL=https://mainnet.base.org
   # BASE_TESTNET_URL=https://goerli.base.org
   ```

## Compiling the Contract

```bash
npx hardhat compile
```

## Deploying the Contract

### Deploy to Base Testnet (Goerli)

```bash
npx hardhat run scripts/deploy.js --network baseGoerli
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.js --network base
```

## Verifying the Contract

After deployment, verify your contract on Basescan:

```bash
npx hardhat verify --network base CONTRACT_ADDRESS
```

Replace `CONTRACT_ADDRESS` with the address of your deployed contract.

## Usage

The contract includes the following main functions:

- `lockTokens`: Lock ERC20 tokens for a specified duration
- `withdrawTokens`: Withdraw tokens after the lock period expires
- `extendLock`: Extend the lock period for an existing lock
- `getUserLocks`: View all locks for a specific user
- `getLockById`: Get details of a specific lock

## Security

- The contract uses OpenZeppelin's standard libraries
- ReentrancyGuard to prevent reentrancy attacks
- Ownable2Step for secure ownership management
- SafeERC20 for secure token transfers

## License

MIT
