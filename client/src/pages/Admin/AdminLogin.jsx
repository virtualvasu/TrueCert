import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { ArrowRight } from 'lucide-react'; 

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS; 

const AdminLogin = () => {
  const [userAccount, setUserAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

const handleRedirect = () => {

  navigate('/admin/login')
  setMessage('');
};


  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setMessage('MetaMask is not installed. Please install MetaMask to proceed.');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        setMessage('No MetaMask account connected. Please try again.');
        return;
      }

      const connectedAccount = accounts[0];
      setUserAccount(connectedAccount);
      setIsConnected(true);

      
      if (connectedAccount.toLowerCase() === adminAddress.toLowerCase()) {
        setMessage('Login successful! Redirecting to admin home page...');
        setTimeout(() => navigate('/admin/home'), 1000); 
      } else {
        setMessage('You are not authorized to access the admin page.');
        setIsConnected(false); 
      }
    } catch (err) {
      console.error(err.message);
      setMessage(`Error: ${err.message}`);
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

          {message && (
            <p
              className={`text-center mb-4 font-medium ${
                message.includes('successful') ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}

          {isConnected ? (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">
                Connected to MetaMask as: {userAccount}
              </p>
            </div>
          ) : (
            <button
              onClick={connectMetaMask}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-lg font-semibold"
            >
              Connect MetaMask
            </button>
          )}

          {!isConnected && message.includes('not authorized') && (
            <div className="text-center mt-4">
              <button
                onClick={handleRedirect}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
