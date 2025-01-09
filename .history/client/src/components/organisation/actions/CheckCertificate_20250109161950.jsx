import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from './contractDetails';

const CheckCertificate = () => {
    const [ipfsHash, setIpfsHash] = useState('');
    const [loading, setLoading] = useState(false);

    async function initializeWeb3() {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed. Please install MetaMask to proceed.');
            window.open('https://metamask.io/download.html', '_blank');
            throw new Error('MetaMask not found.');
        }

        const web3 = new Web3(window.ethereum);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }).catch(() => {
            alert('MetaMask connection request was denied.');
            throw new Error('MetaMask connection denied.');
        });

        if (!accounts || accounts.length === 0) {
            alert('MetaMask is not connected. Please connect your account.');
            throw new Error('No MetaMask account connected.');
        }
        console.log('MetaMask connected:', accounts[0]);

        return { web3, userAccount: accounts[0] };
    }

    const handleCheckCertificate = async () => {
        try {
            setLoading(true);

            const { web3 } = await initializeWeb3();

            if (!ipfsHash || !/^[a-zA-Z0-9]{46}$/.test(ipfsHash)) {
                alert('Please enter a valid IPFS hash.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const exists = await contract.methods.checkExistence(ipfsHash, accounts[0]).call();

            console.log('Certificate exists:', exists);
            alert(exists ? 'Certificate exists on the blockchain.' : 'Certificate does not exist.');
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
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
                    className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 ${
                        loading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Check Certificate'}
                </button>
            </div>
            <p className="text-gray-600 text-sm mt-4 text-center">
                Make sure you have MetaMask installed and connected.
            </p>
        </div>
    );
};

export default CheckCertificate;
