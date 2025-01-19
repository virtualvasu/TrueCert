import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Importing icons

const CheckCertificate = () => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [issuerAddress, setIssuerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // For showing the status message

  // Initialize Web3 with a provider
  const web3 = new Web3(new Web3.providers.HttpProvider(import.meta.env.VITE_INFURA_URL_SEPOLIA)); // e.g., Infura or Alchemy URL

  const handleCheckCertificate = async () => {
    try {
      setLoading(true);
      setStatus(null); // Reset status before checking

      if (!ipfsHash || !/^[a-zA-Z0-9]{46}$/.test(ipfsHash)) {
        setStatus({ message: 'Please enter a valid IPFS hash.', success: false });
        return;
      }

      if (!issuerAddress || !web3.utils.isAddress(issuerAddress)) {
        setStatus({ message: 'Please enter a valid Ethereum address for the issuer.', success: false });
        return;
      }

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      console.log("Interacting with contract...");

      // Call the smart contract function with both IPFS hash and issuer address
      const exists = await contract.methods
        .checkExistence(ipfsHash, issuerAddress)
        .call();

      console.log('Certificate exists:', exists);
      setStatus({
        message: exists ? 'Certificate exists on the blockchain.' : 'Certificate does not exist or is issued by some other organisation.',
        success: exists,
      });
    } catch (error) {
      console.error('Error:', error.message);
      setStatus({ message: `Error: ${error.message}`, success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Verify Certificate
      </h2>
      <div className="space-y-4">
        {/* Input for IPFS Hash */}
        <div className="relative">
          <input
            type="text"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            placeholder="Enter IPFS Hash"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute top-0 right-2 text-indigo-500">
            <FaCheckCircle />
          </div>
        </div>

        {/* Input for Issuer Address */}
        <div className="relative">
          <input
            type="text"
            value={issuerAddress}
            onChange={(e) => setIssuerAddress(e.target.value)}
            placeholder="Enter Issuer Organization Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute top-0 right-2 text-indigo-500">
            <FaCheckCircle />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCheckCertificate}
          className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
            loading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Certificate'}
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {status.success ? (
              <FaCheckCircle className="mr-2 text-green-500" />
            ) : (
              <FaExclamationCircle className="mr-2 text-red-500" />
            )}
            <p className="text-lg">{status.message}</p>
          </div>
        </div>
      )}

      <p className="text-gray-600 text-sm mt-4 text-center">
        Enter the details carefully. Ensure you have an Ethereum node accessible.
      </p>
    </div>
  );
};

export default CheckCertificate;
