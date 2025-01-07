import React, { useState } from 'react';
import Web3 from 'web3';

const contractAddress = '0x8f5f84d66D04BcAe4DdBfe4F7939Ef46B4639880'; // Replace with your contract address

const contractABI = [
    // The contract ABI remains the same
];

const RevokeCertificate = () => {
    const [revokeIpfsHash, setRevokeIpfsHash] = useState('');

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

    const handleRevokeCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();
            if (!revokeIpfsHash) {
                alert('Please enter an IPFS hash.');
                return;
            }
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const transaction = await contract.methods.revokeCertificate(revokeIpfsHash).send({ from: userAccount });
            alert(`Certificate revoked! Transaction Hash: ${transaction.transactionHash}`);
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Revoke Certificate</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={revokeIpfsHash}
                    onChange={(e) => setRevokeIpfsHash(e.target.value)}
                    placeholder="Enter IPFS Hash"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                />
                <button
                    onClick={handleRevokeCertificate}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                    Revoke Certificate
                </button>
            </div>
        </div>
    );
};

export default RevokeCertificate;
