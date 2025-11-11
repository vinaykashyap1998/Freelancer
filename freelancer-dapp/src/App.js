import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import ClientDashboard from "./components/ClientDashboard";
import FreelancerDashboard from "./components/FreelancerDashboard";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50" id="app-container">
        <Navigation user={user} setUser={setUser} />
        
        <Routes>
          <Route 
            path="/" 
            element={<Home user={user} setUser={setUser} />} 
          />
          <Route 
            path="/client" 
            element={
              user ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 main-content-area">
                  <ClientDashboard user={user} />
                </div>
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Connect Your Wallet</h2>
                    <p className="text-gray-600">You need to connect your wallet to access the client dashboard.</p>
                  </div>
                </div>
              )
            } 
          />
          <Route 
            path="/freelancer" 
            element={
              user ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 main-content-area">
                  <FreelancerDashboard user={user} />
                </div>
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Connect Your Wallet</h2>
                    <p className="text-gray-600">You need to connect your wallet to access the freelancer dashboard.</p>
                  </div>
                </div>
              )
            } 
          />
        </Routes>

        {/* Footer */}
        <footer className="footer-modern mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 main-content-area">
            <div className="text-center text-gray-500 text-sm">
              <p>&copy; 2025 Freelancer DApp. Made with ❤️ using React & Ethereum</p>
              <p className="mt-2">Contract: 0x00AF22fFd8af3b7dF784dda370BC9A4B1993E35a | Sepolia Testnet</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
