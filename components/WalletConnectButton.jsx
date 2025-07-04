import React from "react";

function WalletConnectButton({ walletAddress, onConnect }) {
  return (
    <button onClick={onConnect} className="connect-btn">
      {walletAddress
        ? `Connected: ${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
}

export default WalletConnectButton;
