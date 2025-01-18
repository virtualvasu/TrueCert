import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

const IssuerLogin = () => {
  const [userAccount, setUserAccount] = useState(null);
  const [error, setError] = useState('');
  const [orgExists, setOrgExists] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [issuerAddress, setIssuerAddress] = useState('');
  const [issuerName, setIssuerName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // New state for success message
  const navigate = useNavigate();

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

  const checkOrganisation = async (web3, userAccount) => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const organisationExists = await contract.methods.checkOrganisationExistence(userAccount).call();

      console.log('Organisation Address:', userAccount);
      console.log('Organisation exists:', organisationExists);

      setOrgExists(organisationExists);
    } catch (error) {
      console.error("Error:", error.message);
      setError(`Error: ${error.message}`);
    }
  };

  const handleRequestRegistration = async () => {
    setIsRequesting(true);
    try {
      // Prepare email data
      const registrationData = {
        recipient: import.meta.env.VITE_RECIEVER_EMAIL,
        subject: 'TrueCert issuer registration request',
        body: `Issuer's blockchain address: ${issuerAddress}\nIssuer's name: ${issuerName}`,
      };

      // Send registration request to the backend
      const serverURL = import.meta.env.VITE_SERVER_URL;
      const response = await fetch(`${serverURL}/registration/fromissuer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Registration request sent successfully');
        setSuccessMessage('Your registration request has been sent, wait for admin\'s approval.');
      } else {
        setError('Failed to send registration request. Please try again.');
      }
    } catch (err) {
      console.error('Error sending registration request:', err);
      setError('Failed to send registration request. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRedirect = () => {
    navigate('/user/issuer/home');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Issuer Login</h2>

        <button
          onClick={initializeWeb3}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
        >
          Connect MetaMask
        </button>

        {userAccount && (
          <div className="mt-6 text-center text-green-600">
            <p className="font-medium">Connected Account: {userAccount}</p>
          </div>
        )}

        {orgExists !== null && (
          <div className="mt-6">
            {orgExists ? (
              <div className="flex items-center justify-center bg-green-100 p-4 rounded-lg shadow-md">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                <p className="text-green-600 font-medium">Your organization is registered in the blockchain!</p>
              </div>
            ) : (
              <div className="flex items-center justify-center bg-red-100 p-4 rounded-lg shadow-md">
                <XCircleIcon className="w-6 h-6 text-red-600 mr-3" />
                <p className="text-red-600 font-medium">Your organization is not registered as an issuer on <b>TrueCert</b>.</p>
              </div>
            )}
          </div>
        )}

        {orgExists && (
          <div className="mt-6">
            <button
              onClick={handleRedirect}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl shadow-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              Go to Issuer Home
            </button>
          </div>
        )}

        {orgExists === false && (
          <div className="mt-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleRequestRegistration();
            }}>
              <div className="mb-4">
                <label htmlFor="issuerAddress" className="block text-sm font-medium text-gray-700">Issuer's Blockchain Address</label>
                <input
                  id="issuerAddress"
                  type="text"
                  value={issuerAddress}
                  onChange={(e) => setIssuerAddress(e.target.value)}
                  required
                  className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="issuerName" className="block text-sm font-medium text-gray-700">Issuer's Name</label>
                <input
                  id="issuerName"
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  required
                  className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-xl shadow-xl hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                disabled={isRequesting}
              >
                {isRequesting ? 'Requesting...' : 'Request Registration'}
              </button>
            </form>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 text-center text-green-600">
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuerLogin;
