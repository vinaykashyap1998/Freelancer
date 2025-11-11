# Freelancer DApp - Decentralized Freelancing Platform

A modern, blockchain-based freelancing platform built on Ethereum that enables secure project management, milestone-based payments, and transparent collaboration between clients and freelancers.

## 🚀 Features

### For Clients
- **Create Projects**: Set up new projects with freelancer addresses and funding
- **Milestone Management**: Break down projects into manageable milestones with specific payments
- **Secure Escrow**: Funds are held in smart contracts until milestones are approved
- **Instant Payments**: Automatic payment release upon milestone approval
- **Project Tracking**: Monitor project progress and payment status

### For Freelancers
- **Project Dashboard**: View all assigned projects and their status
- **Milestone Tracking**: See milestone progress and payment status
- **Transparent Payments**: All payments are recorded on the blockchain
- **Automatic Receipts**: Receive payments instantly upon client approval

### Platform Features
- **Smart Contract Security**: All transactions secured by Ethereum smart contracts
- **Transparent Fees**: 2.5% platform fee clearly displayed
- **Blockchain Transparency**: All project data and payments are publicly verifiable
- **MetaMask Integration**: Seamless wallet connection and transaction signing

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity
- **Web3**: Web3.js for blockchain interaction
- **Wallet**: MetaMask integration

## 📋 Prerequisites

Before running the application, make sure you have:

1. **Node.js** (v14 or higher)
2. **MetaMask** browser extension installed
3. **Sepolia ETH** for testing (get from [Sepolia Faucet](https://sepoliafaucet.com/))
4. **MetaMask configured** for Sepolia testnet

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd freelancer-dapp
npm install
```

### 2. Configure MetaMask

1. Open MetaMask and switch to **Sepolia Testnet**
2. Add Sepolia network if not already added:
   - Network Name: Sepolia Test Network
   - RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

### 3. Get Test ETH

Visit [Sepolia Faucet](https://sepoliafaucet.com/) to get free test ETH for transactions.

### 4. Start the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## 📱 How to Use

### For Clients

1. **Connect Wallet**: Click "Connect MetaMask" and approve the connection
2. **Navigate to Client Dashboard**: Use the navigation menu
3. **Create Project**: 
   - Click "New Project" button
   - Enter freelancer's wallet address
   - Set project title and total amount
   - Fund the project with ETH
4. **Add Milestones**: 
   - Click "Add Milestone" for each project
   - Set milestone description and payment amount
5. **Approve Payments**: 
   - Review completed work
   - Click "Approve & Pay" to release milestone payments

### For Freelancers

1. **Connect Wallet**: Click "Connect MetaMask" and approve the connection
2. **Navigate to Freelancer Dashboard**: Use the navigation menu
3. **View Projects**: See all projects you're assigned to
4. **Track Milestones**: Monitor milestone status and payments
5. **Receive Payments**: Payments are automatically sent to your wallet upon approval

## 🔗 Smart Contract Details

- **Contract Address**: `0x00AF22fFd8af3b7dF784dda370BC9A4B1993E35a`
- **Network**: Sepolia Testnet
- **Platform Fee**: 2.5%
- **View on Etherscan**: [Contract Details](https://sepolia.etherscan.io/address/0x00AF22fFd8af3b7dF784dda370BC9A4B1993E35a)

## 🏗️ Project Structure

```
freelancer-dapp/
├── src/
│   ├── components/
│   │   ├── ClientDashboard.js      # Client-specific dashboard
│   │   ├── ConnectWallet.js       # Wallet connection component
│   │   ├── CreateProject.js       # Project creation form
│   │   ├── FreelancerDashboard.js # Freelancer-specific dashboard
│   │   ├── Home.js                # Landing page
│   │   ├── MilestoneManager.js    # Milestone management
│   │   ├── Navigation.js          # Navigation component
│   │   └── ProjectList.js         # Project listing
│   ├── contracts/
│   │   └── Freelancer.json        # Contract ABI
│   ├── App.js                     # Main application with routing
│   ├── App.css                    # Custom styles
│   └── web3Config.js              # Web3 configuration
├── public/
└── package.json
```

## 🔒 Security Features

- **Smart Contract Escrow**: Funds are held securely in smart contracts
- **Milestone-based Payments**: Payments released only upon approval
- **Platform Fee Transparency**: Clear fee structure (2.5%)
- **Blockchain Immutability**: All transactions are permanent and verifiable
- **No Central Authority**: Decentralized platform with no single point of failure

## 🐛 Troubleshooting

### Common Issues

1. **"Please install MetaMask"**: Make sure MetaMask is installed and enabled
2. **"Insufficient funds"**: Ensure you have enough Sepolia ETH for gas fees
3. **"Transaction failed"**: Check if you're on the correct network (Sepolia)
4. **"Contract not found"**: Verify the contract address is correct

### Getting Help

- Check MetaMask is connected to Sepolia testnet
- Ensure you have sufficient ETH for gas fees
- Verify the contract address is correct
- Check browser console for error messages

## 🚀 Deployment

To deploy to production:

1. Update the contract address in `web3Config.js`
2. Build the application: `npm run build`
3. Deploy the `build` folder to your hosting service
4. Configure your domain to serve the React app

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the smart contract on Etherscan

---

**Built with ❤️ using React, Ethereum, and Web3.js**