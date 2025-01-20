import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails'; // Ensure these are correct paths
import { useNavigate } from 'react-router-dom';
import { initializeWeb3 } from '../../../utils/web3Utils';
// Function to initialize Web3 and connect to MetaMask
// async function initializeWeb3() {
//   if (typeof window.ethereum === 'undefined') {
//     console.error('MetaMask is not installed.');
//     throw new Error('MetaMask not found.');
//   }

//   const web3 = new Web3(window.ethereum);

//   try {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     if (!accounts || accounts.length === 0) {
//       console.error('MetaMask is not connected.');
//       throw new Error('No MetaMask account connected.');
//     }

//     // Convert account to checksummed format
//     const userAccount = web3.utils.toChecksumAddress(accounts[0]);
//     console.log('MetaMask connected:', userAccount);

//     return { web3, userAccount };
//   } catch (error) {
//     console.error('Failed to connect to MetaMask:', error.message);
//     throw error;
//   }
// }

// OrgProfile component
function IssuerProfile() {
  const [orgDetails, setOrgDetails] = useState({ address: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleDisconnect = () => {
    navigate('/user/issuer/login');
  };

  // Automatically fetch profile info when component is mounted
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const { web3, userAccount } = await initializeWeb3();
        console.log('Web3 initialized:', web3);
        console.log('User account:', userAccount);

        // Initialize contract instance
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log('Contract initialized:', contract);

        // Call the getOrgName function from the smart contract
        const orgName = await contract.methods.getOrgName(userAccount).call();
        console.log('Organisation Name:', orgName);

        // Update state with organization details
        setOrgDetails({ address: userAccount, name: orgName });
      } catch (error) {
        setError('Failed to retrieve profile info. Please try again.');
        console.error('Error retrieving profile info:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-300 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-indigo-800">Organisation Profile</h2>
          <p className="text-lg text-gray-600 mt-2">View and manage your organisation details below.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Profile Details */}
        {loading ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg shadow-xl flex flex-col items-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-semibold mb-6">
              {orgDetails.name ? orgDetails.name[0].toUpperCase() : 'N/A'}
            </div>

            {/* Profile Info */}
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-indigo-800 mb-4">
                {orgDetails.name || 'No Name Found'}
              </h3>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Organisation Address:</span> {orgDetails.address}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
              {/* <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">
                Edit Profile
              </button> */}
              <button className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-200"
              onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssuerProfile;
