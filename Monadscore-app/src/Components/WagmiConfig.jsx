import React from "react";  // Import React explicitly
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, useAccount, useChainId, useDisconnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { defineChain } from "viem";
import { useSwitchChain } from "wagmi";



export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    name: "tMON",
    symbol: "tMON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://monad-testnet.drpc.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://explorer.testnet.monad.xyz",
    },
  },
  testnet: true,
});




// **WalletConnect Project ID**
const projectId = import.meta.env.VITE_PROJECT_ID;

// **RainbowKit & Wagmi Config**
const config = getDefaultConfig({
  appName: "My DApp",
  projectId,
  chains: [monadTestnet], // ❗ Only Monad Testnet is allowed
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: false,
});

// **✅ Define QueryClient here**
const queryClient = new QueryClient();

// **Manually Switch Network**
async function switchToMonadTestnet() {
  const requiredChainId = `0x${monadTestnet.id.toString(16)}`; // Convert 4242 to hex (0x1092)
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requiredChainId }],
      });
    } catch (error) {
      // If Monad Testnet is not added, prompt user to add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: requiredChainId,
                chainName: monadTestnet.name,
                rpcUrls: monadTestnet.rpcUrls.default.http,
                nativeCurrency: monadTestnet.nativeCurrency,
                blockExplorerUrls: [monadTestnet.blockExplorers.default.url],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Monad Testnet:", addError);
        }
      } else {
        console.error("Failed to switch network:", error);
      }
    }
  } else {
    alert("MetaMask or a compatible wallet is required.");
  }
}

// **Auto-Switch to Monad Testnet**
function NetworkGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId(); // ✅ Use this instead of useNetwork
  const { disconnect } = useDisconnect();

  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      alert("Switching to Monad Testnet...");
      switchToMonadTestnet();
    }

  }, [chainId, isConnected]);

  return null;
}




// **Main Providers Component**
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider chains={[monadTestnet]} >
          <NetworkGuard /> {/* Ensures correct network */}
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
