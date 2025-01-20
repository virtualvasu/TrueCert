import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS;

const AdminLogin = () => {
  const [userAccount, setUserAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/admin/login');
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ArrowRight className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">TrueCert</h1>
            <p className="text-lg mt-2 text-blue-100">Blockchain-Powered Certificate Management</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Admin Login</h2>

          {message && (
            <p
              className={`text-center mb-4 font-medium ${
                message.includes('successful') ? 'text-green-700' : 'text-red-700'
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
            <Button onClick={connectMetaMask} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-lg font-semibold">
              Connect MetaMask
            </Button>
          )}

          {!isConnected && message.includes('not authorized') && (
            <div className="text-center mt-4">
              <Button onClick={handleRedirect} className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
