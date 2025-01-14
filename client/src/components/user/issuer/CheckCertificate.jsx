import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails';

const CheckCertificate = () => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [issuerAddress, setIssuerAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Web3 with a provider
  const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/552a80119c09433184870a43c973971c')); // e.g., Infura or Alchemy URL

  const handleCheckCertificate = async () => {
    try {
      setLoading(true);

      if (!ipfsHash || !/^[a-zA-Z0-9]{46}$/.test(ipfsHash)) {
        alert('Please enter a valid IPFS hash.');
        return;
      }

      if (!issuerAddress || !web3.utils.isAddress(issuerAddress)) {
        alert('Please enter a valid Ethereum address for the issuer.');
        return;
      }

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      console.log("Interacting with contract...");

      // Call the smart contract function with both IPFS hash and issuer address
      const exists = await contract.methods
        .checkExistence(ipfsHash, issuerAddress)
        .call();

      console.log('Certificate exists:', exists);
      alert(exists ? 'Certificate exists on the blockchain.' : 'Certificate does not exist or is issued by some other organisation.');
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Check Certificate Existence
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          placeholder="Enter IPFS Hash"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={issuerAddress}
          onChange={(e) => setIssuerAddress(e.target.value)}
          placeholder="Enter Issuer Organization Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCheckCertificate}
          className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Certificate'}
        </button>
      </div>
      <p className="text-gray-600 text-sm mt-4 text-center">
        Ensure you have an Ethereum node accessible.
      </p>
    </div>
  );
};

export default CheckCertificate;