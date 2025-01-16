import React, { useState } from 'react';
import Web3 from 'web3';

import { contractAddress, contractABI } from '../../assets/contractDetails';

const CheckOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [exists, setExists] = useState(null);
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

    async function handleCheckOrganisation() {
        try {
            const { web3 } = await initializeWeb3();

            if (!orgAddress) {
                setMessage('Please enter an organisation address.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const organisationExists = await contract.methods.checkOrganisationExistence(orgAddress).call();

            setExists(organisationExists);
            setMessage('');
        } catch (error) {
            console.error('Error:', error.message);
            setMessage(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6 rounded-2xl">
            <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
                <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
                    <h2 className="text-3xl font-bold text-center">Check Organisation</h2>
                </header>

                <div className="p-6">
                    {message && (
                        <p
                            className={`text-center mb-4 font-medium ${
                                message.includes('Error') ? 'text-red-500' : 'text-yellow-500'
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
                    <button
                        onClick={handleCheckOrganisation}
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-lg font-semibold"
                    >
                        Check Organisation
                    </button>
                    {exists !== null && (
                        <div className="mt-6 text-center">
                            {exists ? (
                                <p className="text-green-500 font-medium text-lg">
                                    Organisation exists in the blockchain!
                                </p>
                            ) : (
                                <p className="text-red-500 font-medium text-lg">
                                    Organisation does not exist.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckOrganisation;
