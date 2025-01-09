import React, { useState } from 'react';
import Web3 from 'web3';

import {contractAddress, contractABI} from './contractDetails';

const CheckCertificate = () => {
    const [ipfsHash, setIpfsHash] = useState('');

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

    const handleCheckCertificate = async () => {
        try {
            const { web3 } = await initializeWeb3();
            if (!ipfsHash) {
                alert('Please enter an IPFS hash.');
                return;
            }
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const exists = await contract.methods.checkExistence(ipfsHash).call();
            alert(exists ? "Certificate exists on the blockchain." : "Certificate does not exist.");
        } catch (error) {
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Check Certificate Existence
            </h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={ipfsHash}
                    onChange={(e) => setIpfsHash(e.target.value)}
                    placeholder="Enter IPFS Hash"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleCheckCertificate}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Check Certificate
                </button>
            </div>
            <p className="text-gray-600 text-sm mt-4 text-center">
                Make sure you have MetaMask installed and connected.
            </p>
        </div>
    );
};

export default CheckCertificate;
