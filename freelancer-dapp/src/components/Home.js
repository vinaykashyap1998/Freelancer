import React from "react";
import { Link } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";

function Home({ user, setUser }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
            Decentralized
            <span className="gradient-text">
              {" "}Freelancing
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Manage your freelance projects on the blockchain. Secure payments, 
            transparent milestones, and trustless collaboration between clients and freelancers.
          </p>
          
          {!user ? (
            <div className="space-y-4">
              <div className="max-w-xs mx-auto"><ConnectWallet setUser={setUser} /></div>
              <p className="text-sm text-gray-500 mt-2">
                Connect your MetaMask wallet to get started
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/client"
                className="btn-primary text-lg"
              >
                📋 Client Dashboard
              </Link>
              <Link
                to="/freelancer"
                className="btn-secondary text-lg"
              >
                💼 Freelancer Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Built on Ethereum blockchain for maximum security and transparency
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-modern text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-4">Secure Payments</h3>
            <p className="text-gray-400">
              Smart contracts ensure secure escrow and automatic milestone payments. 
              No middleman, no disputes.
            </p>
          </div>

          <div className="card-modern text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-4">Transparent Tracking</h3>
            <p className="text-gray-400">
              All project progress and payments are recorded on the blockchain. 
              Complete transparency for all parties.
            </p>
          </div>

          <div className="card-modern text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-4">Instant Payments</h3>
            <p className="text-gray-400">
              Automated milestone approvals release payments instantly. 
              No waiting for manual processing.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Simple steps to get your project started
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-400 text-sm">
                Connect your MetaMask wallet to access the platform
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Project</h3>
              <p className="text-gray-400 text-sm">
                Clients create projects and fund them with ETH
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Set Milestones</h3>
              <p className="text-gray-400 text-sm">
                Break down work into milestones with specific payments
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent">
                <span className="text-2xl font-bold text-accent">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Paid</h3>
              <p className="text-gray-400 text-sm">
                Freelancers receive payments automatically upon approval
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Info */}
      <div className="bg-blue-900 py-16 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Smart Contract Deployed</h2>
          <p className="text-gray-400 mb-6">
            Contract Address: 0x00AF22fFd8af3b7dF784dda370BC9A4B1993E35a
          </p>
          <p className="text-gray-400">
            Network: Sepolia Testnet | Platform Fee: 2.5%
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
