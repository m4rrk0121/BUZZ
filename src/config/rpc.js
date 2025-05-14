import { http } from 'wagmi';

export function createRPCTransport(chainId) {
  // Simple RPC endpoint for Base chain
  return http('https://mainnet.base.org');
} 