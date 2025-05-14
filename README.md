# BUZZ NFT Minting Application

BUZZ is a modern web3 application for minting NFTs on the Base network. The platform offers a seamless experience for users to connect their wallets and mint exclusive NFTs.

## Features

- **Wallet Connectivity**: Connect easily using MetaMask or other Web3 wallets
- **NFT Minting**: Mint up to 10 NFTs per transaction
- **User-Friendly Interface**: Intuitive UI designed for both beginner and experienced users
- **Jungle-Themed Design**: Immersive visual experience with custom graphics

## Technology Stack

- **Frontend**: React.js
- **Web3 Integration**: Wagmi and @reown/appkit
- **Styling**: Custom CSS
- **Blockchain**: Base Network

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository
```bash
git clone https://github.com/m4rrk0121/BUZZ.git
cd BUZZ
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory based on `.env.template`

4. Start the development server
```bash
npm start
```

The application will be available at http://localhost:3000.

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the navigation bar
2. **Navigate to NFT Mint Tab**: Go to the NFT Mint section
3. **Select Quantity**: Choose the number of NFTs you wish to mint (1-10)
4. **Complete Transaction**: Confirm the transaction in your wallet

## Environment Configuration

The application uses environment variables for configuration. See `.env.template` for available options.

## Deployment

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## License

MIT
