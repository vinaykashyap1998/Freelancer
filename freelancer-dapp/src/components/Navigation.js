import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navigation({ user, setUser }) {
  const location = useLocation();

  const disconnectWallet = () => {
    setUser(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav-bar-modern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">🚀</div>
            <span className="text-xl font-bold text-accent">Freelancer DApp</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex space-x-1">
              <Link
                to="/client"
                className={`nav-link-modern ${
                  isActive('/client') 
                    ? 'bg-blue-900 text-accent' 
                    : ''
                }`}
              >
                Client Dashboard
              </Link>
              <Link
                to="/freelancer"
                className={`nav-link-modern ${
                  isActive('/freelancer') 
                    ? 'bg-purple-900 text-accent' 
                    : ''
                }`}
              >
                Freelancer Dashboard
              </Link>
            </div>
          )}

          {/* User Info & Disconnect */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-900 text-accent border border-green-700 px-3 py-2 rounded-full text-sm font-medium">
                <span>🦊</span>
                <span>{user.slice(0, 6)}...{user.slice(-4)}</span>
              </div>
              <button
                onClick={disconnectWallet}
                className="text-accent hover:text-white text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
