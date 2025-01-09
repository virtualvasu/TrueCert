import React, { useState } from 'react';
import Web3 from 'web3';

import { contractAddress, contractABI } from './contractDetails';

const CheckOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [exists, setExists] = useState(null);

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

    async function handleCheckOrganisation() {
        try {
            const { web3 } = await initializeWeb3();

            if (!orgAddress) {
                alert('Please enter an organisation address.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const organisationExists = await contract.methods.checkOganisationExistence(orgAddress).call();
            console.log('Organisation exists:', organisationExists);

            setExists(organisationExists);
        } catch (error) {
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Check Organisation</h2>
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
                <button
                    onClick={handleCheckOrganisation}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Check Organisation
                </button>
                {exists !== null && (
                    <div className="mt-4 text-center">
                        {exists ? (
                            <p className="text-green-600 font-medium">Organisation exists in the blockchain!</p>
                        ) : (
                            <p className="text-red-600 font-medium">Organisation does not exist.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckOrganisation;
