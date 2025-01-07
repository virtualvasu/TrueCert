import React, { useState } from 'react';
import Web3 from 'web3';

const contractAddress = '0x8f5f84d66D04BcAe4DdBfe4F7939Ef46B4639880'; // Replace with your contract address

const contractABI = [
    // Include your contract ABI here
];

const StoreOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [orgName, setOrgName] = useState('');

    async function initializeWeb3() {
        if (typeof window.ethereum === 'undefined') {
          alert('MetaMask is not installed. Please install MetaMask to proceed.');
          throw new Error('MetaMask not found.');
      }
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
          alert('MetaMask is not connected. Please connect your account.');
          throw new Error('No MetaMask account connected.');
      }
      return { web3, userAccount: accounts[0] };
  }

  async function handleStoreOrganisation() {
      try {
          const { web3, userAccount } = await initializeWeb3();
          // Replace with actual admin address for validation
          const adminAddress = '0x3d7178de2a7d863629d429635db30a687a0a2f65'; 
          
          if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
              alert('You must be the admin to store the organisation. Please switch to the admin account.');
              return;
          }

          if (!orgAddress || !orgName) {
              alert('Please fill in both fields.');
              return;
          }

          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const transaction = await contract.methods.storeOrganisation(orgAddress, orgName).send({ from: userAccount });
          
          alert(`Organisation stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
      } catch (error) {
          console.error("Error:", error.message);
          alert(`Error: ${error.message}`);
      }
  }

  return (
      <div>
          <h2>Store Organisation</h2>
          <label htmlFor="orgAddress">Organisation Address:</label>
          <input type="text" value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} placeholder="Enter organisation address"/>
          <label htmlFor="orgName">Organisation Name:</label>
          <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Enter organisation name"/>
          <button onClick={handleStoreOrganisation}>Store Organisation</button>
      </div>
  );
};

export default StoreOrganisation;
