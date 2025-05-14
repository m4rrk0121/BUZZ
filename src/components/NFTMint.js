import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { appKitInstance } from '../App';
import './modal.css';

// Base network chain ID (mainnet)
const BASE_CHAIN_ID = 8453;

// Recipient wallet address
const RECIPIENT_ADDRESS = "0xaD0772B609fb4A37bDA75B283F4f6F9653939d1d";

// Mint price in ETH
const MINT_PRICE = "0.01";

// Convert ETH to Wei value in hex format for the transaction
function ethToWeiHex(ethAmount) {
  // 1 ETH = 10^18 Wei
  const weiAmount = Math.floor(ethAmount * 1000000) * 1000000000000; // Safe multiplication to avoid precision issues
  return "0x" + weiAmount.toString(16);
}

function NFTMint() {
  const [mintCount, setMintCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  
  // Use wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // Handle mint count changes
  const handleMintCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (count > 0 && count <= 10) {
      setMintCount(count);
    }
  };
  
  // Handle mint action - this will transfer ETH directly to the specified address
  const handleMint = async () => {
    if (!isConnected) {
      appKitInstance.open();
      return;
    }
    
    // Validate chain ID
    if (chainId !== BASE_CHAIN_ID) {
      setError("Please switch to Base Network to mint NFTs");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setTxHash("");
    
    try {
      // Calculate total price based on mint count
      const totalPriceInEth = parseFloat(MINT_PRICE) * mintCount;
      
      // Convert ETH to Wei in hex format
      const totalPriceInWeiHex = ethToWeiHex(totalPriceInEth);
      
      // Check if ethereum is available in the browser
      if (!window.ethereum) {
        throw new Error("MetaMask or another Web3 provider is not installed");
      }
      
      // Send the transaction
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: RECIPIENT_ADDRESS,
          value: totalPriceInWeiHex,
        }],
      });
      
      // Set transaction hash and success state
      setTxHash(transactionHash);
      setSuccess(true);
      console.log("Transaction sent:", transactionHash);
      
    } catch (error) {
      console.error("Transaction error:", error);
      setError(`Transaction failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h1 className="text-center mb-4">Mint KOA NFT</h1>
        
        {/* NFT Preview */}
        <div className="text-center mb-4">
          <img 
            src="/images/LOGO.png" 
            alt="NFT Preview" 
            className="img-fluid rounded"
            style={{ maxWidth: '300px' }}
          />
        </div>
        
        {/* Mint Controls */}
        <div className="mb-4">
          <div className="form-group mb-3">
            <label htmlFor="mintCount">Number of NFTs to mint (max 10):</label>
            <input
              type="number"
              id="mintCount"
              className="form-control"
              value={mintCount}
              onChange={handleMintCountChange}
              min="1"
              max="10"
            />
          </div>
          
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleMint}
              disabled={isLoading || (chainId !== BASE_CHAIN_ID)}
            >
              {isLoading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Minting...
                </span>
              ) : isConnected ? (
                `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''} for ${parseFloat(MINT_PRICE) * mintCount} ETH`
              ) : (
                'Connect Wallet to Mint'
              )}
            </button>
          </div>
        </div>
        
        {/* Recipient Address */}
        <div className="alert alert-info mb-4" role="alert">
          <small>
            <strong>Recipient Address:</strong> {RECIPIENT_ADDRESS}
          </small>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && txHash && (
          <div className="alert alert-success" role="alert">
            NFT minted successfully! <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">View transaction</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTMint; 