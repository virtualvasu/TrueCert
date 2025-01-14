import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { ArrowRight } from 'lucide-react'; // Importing the icon from lucide-react

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
        <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ArrowRight className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">TrueCert</h1>
            <p className="text-lg mt-2 text-blue-100">
              Blockchain-Powered Certificate Management
            </p>
          </div>
        </header>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Admin Login</h2>

          {isConnected ? (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">
                Connected to MetaMask as: {userAccount}
              </p>
            </div>
          ) : (
            <>
              {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
              <button
                onClick={connectMetaMask}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-lg font-semibold"
              >
                Connect MetaMask
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
