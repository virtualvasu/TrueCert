import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS; // Admin's public address

const AdminLogin = () => {
  const [userAccount, setUserAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Initialize Web3 and connect MetaMask
  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        setError('No MetaMask account connected.');
        return;
      }

      const connectedAccount = accounts[0];
      setUserAccount(connectedAccount);
      setIsConnected(true);

      // Check if the connected account is the admin
      if (connectedAccount.toLowerCase() === adminAddress.toLowerCase()) {
        alert('Login successful! Redirecting to admin home page...');
        navigate('/admin/home'); // Redirect to Admin Home Page
      } else {
        alert('You are not authorized to access the admin page.');
      }
    } catch (err) {
      console.error(err.message);
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Admin Login</h2>
        {isConnected ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">
              Connected to MetaMask as: {userAccount}
            </p>
          </div>
        ) : (
          <>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button
              onClick={connectMetaMask}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Connect MetaMask
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
