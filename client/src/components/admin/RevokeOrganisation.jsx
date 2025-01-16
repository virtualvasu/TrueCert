import React, { useState } from 'react';
import Web3 from 'web3';

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS;

import { contractAddress, contractABI } from '../../assets/contractDetails';

const RevokeOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [message, setMessage] = useState('');

    async function initializeWeb3() {
        if (typeof window.ethereum === 'undefined') {
            setMessage('MetaMask is not installed. Please install MetaMask to proceed.');
            throw new Error('MetaMask not found.');
        }
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            setMessage('MetaMask is not connected. Please connect your account.');
            throw new Error('No MetaMask account connected.');
        }
        return { web3, userAccount: accounts[0] };
    }

    async function handleRevokeOrganisation() {
        try {
            const { web3, userAccount } = await initializeWeb3();

            if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
                setMessage('You must be the admin to revoke the organisation. Please switch to the admin account.');
                return;
            }

            if (!orgAddress) {
                setMessage('Please enter an organisation address.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const transaction = await contract.methods.revokeOrganisation(orgAddress).send({ from: userAccount });

            setMessage(
                `Organisation revoked from the blockchain! Transaction Hash: ${transaction.transactionHash}`
            );
            setOrgAddress(''); 
        } catch (error) {
            console.error('Error:', error.message);
            setMessage(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-blue-300">
                <header className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-center text-white tracking-wide">Revoke Organisation</h2>
                </header>

                <div className="p-6">
                    {message && (
                        <p
                            className={`text-center mb-4 font-medium ${
                                message.includes('Error') ? 'text-red-600' : 'text-green-600'
                            }`}
                        >
                            {message}
                        </p>
                    )}
                    <div className="mb-4">
                        <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-800 mb-2">
                            Organisation Address
                        </label>
                        <input
                            type="text"
                            id="orgAddress"
                            value={orgAddress}
                            onChange={(e) => setOrgAddress(e.target.value)}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-blue-50"
                            placeholder="Enter organisation address"
                        />
                    </div>
                    <button
                        onClick={handleRevokeOrganisation}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    >
                        Revoke Organisation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevokeOrganisation;
