import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WalletHandler = ({ postUserData, invite }) => {
  const { address, isConnected } = useAccount();
  const hasPostedRef = useRef(false);

  // 🔹 Wallet Switch Listener
  useEffect(() => {
    const handleWalletSwitch = (accounts) => {
      if (accounts.length > 0) {
        console.log("Wallet switched to:", accounts[0]);
        hasPostedRef.current = false; // Allow new postUserData request
        window.location.reload(); // Or call postUserData(accounts[0], invite)
      } else {
        console.log("Wallet disconnected");
        // navigate("/");
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleWalletSwitch);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleWalletSwitch);
      }
    };
  }, []);

  return null;
};

export default WalletHandler;
