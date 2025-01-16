import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../assets/contractDetails';

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS;

const StoreOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [orgName, setOrgName] = useState('');
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

    async function handleStoreOrganisation() {
        try {
            const { web3, userAccount } = await initializeWeb3();

            if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
                setMessage('You must be the admin to store the organisation. Please switch to the admin account.');
                return;
            }

            if (!orgAddress || !orgName) {
                setMessage('Please fill in both fields.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const transaction = await contract.methods.storeOrganisation(orgAddress, orgName).send({ from: userAccount });

            setMessage(`Organisation stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
        } catch (error) {
            console.error('Error:', error.message);
            setMessage(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 rounded-2xl">
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
                <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
                    <h2 className="text-3xl font-bold text-center">Store Organisation</h2>
                </header>

                <div className="p-6">
                    {message && (
                        <p
                            className={`text-center mb-4 font-medium ${
                                message.includes('Error') ? 'text-red-500' : 'text-green-500'
                            }`}
                        >
                            {message}
                        </p>
                    )}
                    <div className="mb-4">
                        <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-200 mb-2">
                            Organisation Address
                        </label>
                        <input
                            type="text"
                            id="orgAddress"
                            value={orgAddress}
                            onChange={(e) => setOrgAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-gray-800"
                            placeholder="Enter organisation address"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="orgName" className="block text-sm font-medium text-gray-200 mb-2">
                            Organisation Name
                        </label>
                        <input
                            type="text"
                            id="orgName"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-gray-800"
                            placeholder="Enter organisation name"
                        />
                    </div>
                    <button
                        onClick={handleStoreOrganisation}
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-lg font-semibold"
                    >
                        Store Organisation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreOrganisation;
