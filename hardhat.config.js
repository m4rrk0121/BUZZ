/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Get the private key from the .env file or use a placeholder for local development
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    base: {
      url: process.env.BASE_MAINNET_URL || "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 8453
    },
    baseGoerli: {
      url: process.env.BASE_TESTNET_URL || "https://goerli.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84531
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
      baseGoerli: process.env.BASESCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      }
    ]
  }
}; 