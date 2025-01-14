import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails'; // Ensure these are correct paths

// Function to initialize Web3 and connect to MetaMask
async function initializeWeb3() {
  if (typeof window.ethereum === 'undefined') {
    console.error('MetaMask is not installed.');
    throw new Error('MetaMask not found.');
  }

  const web3 = new Web3(window.ethereum);

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      console.error('MetaMask is not connected.');
      throw new Error('No MetaMask account connected.');
    }

    // Convert account to checksummed format
    const userAccount = web3.utils.toChecksumAddress(accounts[0]);
    console.log('MetaMask connected:', userAccount);

    return { web3, userAccount };
  } catch (error) {
    console.error('Failed to connect to MetaMask:', error.message);
    throw error;
  }
}

// OrgProfile component
function IssuerProfile() {
  const [orgDetails, setOrgDetails] = useState({ address: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="bg-gradient-to-br from-indigo-100 to-purple-200 min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl">
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
            <p className="text-lg text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
            <div className="flex justify-center items-center mb-8">
              {/* Placeholder Avatar */}
              <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-semibold">
                {orgDetails.name ? orgDetails.name[0].toUpperCase() : 'N/A'}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-indigo-800 mb-4">{orgDetails.name || 'No Name Found'}</h3>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Organisation Address:</span> {orgDetails.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssuerProfile;
