import Web3 from "web3";
import FreelancerContract from "./contracts/Freelancer.json";

const web3 = new Web3(window.ethereum);
// Use the deployed contract address from Sepolia
const contractAddress = "0x00AF22fFd8af3b7dF784dda370BC9A4B1993E35a";
const freelancer = new web3.eth.Contract(FreelancerContract.abi, contractAddress);

export { web3, freelancer };