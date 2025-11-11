import React, { useState } from "react";
import { web3 } from "../web3Config";

function ConnectWallet({ setUser }) {
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue!");
      return;
    }

    setLoading(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      
      if (accounts.length > 0) {
        setUser(accounts[0]);
      } else {
        alert("No accounts found. Please make sure MetaMask is unlocked.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        alert("Connection rejected. Please try again.");
      } else {
        alert("Error connecting wallet: " + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="text-center">
      <button
        onClick={connectWallet}
        disabled={loading}
        className="btn-primary w-full py-3"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>🦊</span>
            <span>Connect MetaMask</span>
          </div>
        )}
      </button>
    </div>
  );
}

export default ConnectWallet;
