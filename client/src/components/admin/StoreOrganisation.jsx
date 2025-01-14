import React, { useState } from 'react';
import Web3 from 'web3';

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS;

import {contractAddress, contractABI} from '../../assets/contractDetails';

const StoreOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [orgName, setOrgName] = useState('');

    async function initializeWeb3() {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed. Please install MetaMask to proceed.');
            throw new Error('MetaMask not found.');
        }
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            alert('MetaMask is not connected. Please connect your account.');
            throw new Error('No MetaMask account connected.');
        }
        return { web3, userAccount: accounts[0] };
    }

    async function handleStoreOrganisation() {
        try {
            const { web3, userAccount } = await initializeWeb3();
            

            if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
                alert('You must be the admin to store the organisation. Please switch to the admin account.');
                return;
            }

            if (!orgAddress || !orgName) {
                alert('Please fill in both fields.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const transaction = await contract.methods.storeOrganisation(orgAddress, orgName).send({ from: userAccount });

            alert(`Organisation stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
        } catch (error) {
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Store Organisation</h2>
                <div className="mb-4">
                    <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Organisation Address
                    </label>
                    <input
                        type="text"
                        id="orgAddress"
                        value={orgAddress}
                        onChange={(e) => setOrgAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter organisation address"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
                        Organisation Name
                    </label>
                    <input
                        type="text"
                        id="orgName"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter organisation name"
                    />
                </div>
                <button
                    onClick={handleStoreOrganisation}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Store Organisation
                </button>
            </div>
        </div>
    );
};

export default StoreOrganisation;
