import { useEffect } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

const MONAD_CHAIN_ID = 10143;

// **Monad Testnet Configuration**
const monadTestnet = {
    id: 10143, // Monad Testnet Chain ID
    name: "Monad Testnet",
    network: "monad-testnet",
    rpcUrls: { default: { http: ["https://monad-testnet.drpc.org"] } },
    blockExplorers: { default: { name: "Monad Explorer", url: "https://explorer.testnet.monad.xyz" } },
    nativeCurrency: { name: "tMON", symbol: "tMON", decimals: 18 },
  };

 const useAutoSwitchToMonad = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isConnected) return;

    if (chainId !== MONAD_CHAIN_ID) {
      switchChain({ chainId: MONAD_CHAIN_ID }).catch(async (err) => {
        if (err.code === 4902 && window.ethereum) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "10143",
                chainName: "Monad Testnet",
                nativeCurrency: {
                  name: "Monad",
                  symbol: "MON",
                  decimals: 18,
                },
                rpcUrls: ["https://monad-testnet.drpc.org"],
                blockExplorerUrls: ["https://explorer.testnet.monad.xyz"],
              },
            ],
          });
        } else {
          console.error("Error switching chain:", err);
        }
      });
    }
  }, [isConnected, chainId, switchChain]);
};

export default useAutoSwitchToMonad