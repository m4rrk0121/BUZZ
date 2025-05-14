import React from 'react';
import { Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import Reown AppKit
import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Import theme context
import { ThemeProvider } from './context/ThemeContext';

// Import components
import Home from './components/Home';
import Navbar from './components/Navbar';
import NFTMint from './components/NFTMint';

// ScrollToTop component definition
function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Create query client
const queryClient = new QueryClient();

// Define project ID
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'default-project-id';

// Define networks
const networks = [base];

// Configure metadata
const metadata = {
  name: 'King of Apes',
  description: 'King of Apes NFT Platform',
  url: window.location.origin,
  icons: ['https://kingofapes.fun/favicon.ico']
};

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: networks,
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
  connectors: [
    injected({
      target: 'metaMask',
      shimDisconnect: true,
      shimChainChanged: true,
    }),
    walletConnect({
      projectId,
      metadata,
    }),
    coinbaseWallet({
      appName: 'King of Apes',
      appLogoUrl: 'https://kingofapes.fun/favicon.ico',
    }),
  ],
});

// Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  wagmiConfig,
  projectId,
  networks,
  defaultChain: base,
  metadata,
});

// Create the AppKit instance
export const appKitInstance = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  defaultNetwork: base,
});

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <ScrollToTop />
            <div className="App">
              <Navbar />
              <div className="content-container">
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/nft-mint" element={<NFTMint />} />
                </Routes>
              </div>
            </div>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
