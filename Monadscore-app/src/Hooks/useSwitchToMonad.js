import { useEffect, useState } from "react";
import { useAccount, useConnectorClient } from "wagmi";

const MONAD_CHAIN_ID = 10143;

export const useSwitchToMonad = () => {
  const { isConnected, address } = useAccount();
  const { data: client } = useConnectorClient();
  const [currentChainId, setCurrentChainId] = useState(null);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [chainId, setChainId] = useState(null);
  // Get current chain ID from wallet
  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum) {
        try {
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
          setCurrentChainId(parseInt(chainIdHex, 16));
        } catch (err) {
          console.error("Failed to fetch chainId:", err);
        }
      }
    };

    getChainId();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", getChainId);
    }

    return () => {
      window.ethereum?.removeListener("chainChanged", getChainId);
    };
  }, []);

  // const switchToMonad = async () => {
  //   if (currentChainId === MONAD_CHAIN_ID) {
  //     console.log("Already on Monad Testnet.", currentChainId);
  //     return true;
  //   }
  
  //   if (!isConnected || !address) {
  //     console.error("Wallet not connected.");
  //     return false;
  //   }
  
  //   if (switchingNetwork) {
  //     console.log("Already switching networks.");
  //     return false;
  //   }
  
  //   setSwitchingNetwork(true);
  
  //   try {
  //     const connector = client?.connector;
  
  //     // First try using connector's switchChain
  //     if (connector?.switchChain) {
  //       try {
  //         await connector.switchChain({ chainId: MONAD_CHAIN_ID });
  //         console.log("Switched to Monad Testnet using connector!");
  //         return true;
  //       } catch (err) {
  //         if (err?.code !== 4902) throw err;
  //       }
  //     }
  
  //     // Fallback for connectors like WalletConnect
  //     if (window.ethereum) {
  //       try {
  //         await window.ethereum.request({
  //           method: "wallet_switchEthereumChain",
  //           params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
  //         });
  
  //         console.log("Switched to Monad Testnet via window.ethereum!");
  //         return true;
  //       } catch (err) {
  //         if (err.code === 4902) {
  //           console.log("Monad Testnet not found. Adding...");
  
  //           try {
  //             await window.ethereum.request({
  //               method: "wallet_addEthereumChain",
  //               params: [
  //                 {
  //                   chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
  //                   chainName: "Monad Testnet",
  //                   nativeCurrency: {
  //                     name: "Monad",
  //                     symbol: "MON",
  //                     decimals: 18,
  //                   },
  //                   rpcUrls: ["https://monad-testnet.drpc.org"],
  //                   blockExplorerUrls: ["https://explorer.testnet.monad.xyz"],
  //                 },
  //               ],
  //             });
  
  //             console.log("Monad Testnet added and switched!");
  //             return true;
  //           } catch (addErr) {
  //             console.error("Error adding Monad Testnet:", addErr);
  //             return false;
  //           }
  //         } else {
  //           console.error("Error switching via window.ethereum:", err);
  //           return false;
  //         }
  //       }
  //     } else {
  //       console.error("No provider available.");
  //       return false;
  //     }
  //   } catch (err) {
  //     console.error("Error switching to Monad Testnet:", err);
  //     return false;
  //   } finally {
  //     setSwitchingNetwork(false);
  //   }
  // };


  const switchToMonad = async () => {
    if (currentChainId === MONAD_CHAIN_ID) {
      console.log("Already on Monad Testnet.", currentChainId, MONAD_CHAIN_ID);
      return true;
    }
  
    if (!isConnected || !address) {
      console.error("Wallet not connected.");
      return false;
    }
  
    if (switchingNetwork) {
      console.log("Already switching networks.");
      return false;
    }
  
    setSwitchingNetwork(true);
  
    try {
      if (!window.ethereum) {
        console.error("window.ethereum not available.");
        return false;
      }
  
      // Try switching first
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
        });
  
        console.log("Switched to Monad Testnet!");
        return true;
      } catch (switchError) {
        // If chain is not added to MetaMask yet
        if (switchError.code === 4902) {
          console.log("Monad chain not found in MetaMask. Trying to add...");
  
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
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
  
            console.log("Monad chain added! Switching...");
            // Try switching again after adding
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
            });
  
            console.log("Switched to Monad Testnet after adding!");
            return true;
          } catch (addError) {
            console.error("Failed to add Monad Testnet:", addError);
            return false;
          }
        } else {
          console.error("Failed to switch chain:", switchError);
          return false;
        }
      }
    } finally {
      setSwitchingNetwork(false);
    }
  };
  
  

  // Optional: reconnect logic (same as before)
  const reconnectWallet = async () => {
    if (!isConnected && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length) {
          console.log("Wallet reconnected:", accounts);
        }
      } catch (err) {
        console.error("Error reconnecting wallet:", err);
      }
    }
  };

 

const getCurrentChainId =  () =>{
  console.log("currentChainIdSwitch", currentChainId)
if(currentChainId){
  return currentChainId;

}
}


  useEffect(() => {
    window.ethereum?.on("accountsChanged", reconnectWallet);
    window.ethereum?.on("chainChanged", reconnectWallet);

    return () => {
      window.ethereum?.removeListener("accountsChanged", reconnectWallet);
      window.ethereum?.removeListener("chainChanged", reconnectWallet);
    };
  }, [isConnected]);

  return { switchToMonad, reconnectWallet, switchingNetwork, getCurrentChainId };
};
