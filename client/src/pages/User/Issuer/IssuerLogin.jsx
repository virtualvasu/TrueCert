import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { useNavigate } from 'react-router-dom';  // Import navigate from react-router-dom

const IssuerLogin = () => {
  const [userAccount, setUserAccount] = useState(null);
  const [error, setError] = useState('');
  const [orgExists, setOrgExists] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  // Initialize Web3 and request MetaMask connection
  const initializeWeb3 = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask to proceed.');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {
        setUserAccount(web3.utils.toChecksumAddress(accounts[0]));
        checkOrganisation(web3, web3.utils.toChecksumAddress(accounts[0]));
      } else {
        setError('No MetaMask account connected. Please connect your account.');
      }
    } catch (err) {
      setError('Error connecting to MetaMask. Please try again.');
      console.error(err);
    }
  };

  // Function to check if the organization is registered using the connected MetaMask account
  const checkOrganisation = async (web3, userAccount) => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const organisationExists = await contract.methods.checkOrganisationExistence(userAccount).call();
      
      console.log('Organisation Address:', userAccount);
      console.log('Organisation exists:', organisationExists);

      setOrgExists(organisationExists);

      // Redirect if organisation exists
      if (organisationExists) {
        navigate('/user/issuer/home'); // Use navigate for redirection
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login with MetaMask</h2>
      
      <button
        onClick={initializeWeb3}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        Connect MetaMask
      </button>

      {userAccount && (
        <div className="mt-4 text-center text-green-600">
          <p>Connected Account: {userAccount}</p>
        </div>
      )}

      {orgExists !== null && (
        <div className="mt-4 text-center">
          {orgExists ? (
            <p className="text-green-600 font-medium">Organisation exists in the blockchain!</p>
          ) : (
            <p className="text-red-600 font-medium">Organisation does not exist.</p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default IssuerLogin;
