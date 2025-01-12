import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from './actions/contractDetails';

// Function to initialize Web3 and connect to MetaMask
async function initializeWeb3() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        window.open('https://metamask.io/download.html', '_blank');
        throw new Error('MetaMask not found.');
    }

    const web3 = new Web3(window.ethereum);

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            alert('MetaMask is not connected. Please connect your account.');
            throw new Error('No MetaMask account connected.');
        }

        // Convert account to checksummed format
        const userAccount = web3.utils.toChecksumAddress(accounts[0]);
        console.log('MetaMask connected:', userAccount);

        return { web3, userAccount };
    } catch (error) {
        alert('Failed to connect to MetaMask: ' + error.message);
        throw error;
    }
}

// OrgProfile component
function OrgProfile() {
    const [orgDetails, setOrgDetails] = useState({ address: '', name: '' });

    const handleProfileClick = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();
            console.log('Web3 initialized:', web3);
            console.log('User account:', userAccount);

            // Initialize contract instance
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract initialized:', contract);

            // Call the getOrgName function from the smart contract
            const orgName = await contract.methods.getOrgName(userAccount).call();
            console.log('Organisation Name:', orgName); // Log the organisation name

            // Update state with organization details
            setOrgDetails({ address: userAccount, name: orgName });

            alert('Profile info retrieved successfully.');
        } catch (error) {
            console.error('Error retrieving profile info:', error.message);
            alert('Failed to retrieve profile info: ' + error.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Organisation Profile</h2>
            <button
                onClick={handleProfileClick}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                aria-label="Show Profile Info"
            >
                Show Profile Info
            </button>
            {orgDetails.name && (
                <div className="mt-6">
                    <p className="text-gray-700">
                        <span className="font-bold">Organisation Address:</span> {orgDetails.address}
                    </p>
                    <p className="text-gray-700 mt-2">
                        <span className="font-bold">Organisation Name:</span> {orgDetails.name}
                    </p>
                </div>
            )}
        </div>
    );
}

export default OrgProfile;
