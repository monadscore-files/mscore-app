import React from "react";  // Import React explicitly

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function StyledConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal }) => {
        return (
          <div className="w-full">
            {!account ? (
              <button
                onClick={openConnectModal}
                className="w-full px-4 py-3 bg-[#2B002E] text-white font-semibold rounded-lg shadow-md  transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={openAccountModal}
                  className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
                >
                  {account.displayName}
                </button>
                {/* <span className="bg-gray-200 px-3 py-1 rounded-md text-sm">{chain?.name}</span> */}
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}


