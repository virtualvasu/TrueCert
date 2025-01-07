import React, { useState } from 'react';
import Web3 from 'web3';

const contractAddress = '0x8f5f84d66D04BcAe4DdBfe4F7939Ef46B4639880'; // Replace with your contract address

const contractABI = [
    {
        "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "name": "certificates",
        "outputs": [
            { "internalType": "address", "name": "issuerAddress", "type": "address" },
            { "internalType": "uint256", "name": "timeStamp", "type": "uint256" },
            { "internalType": "bool", "name": "isRevoked", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_ipfsHash", "type": "string" },
            { "internalType": "address", "name": "_issuerAddress", "type": "address" }
        ],
        "name": "checkExistence",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_orgAddress", "type": "string" }
        ],
        "name": "checkOganisationExistence",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_ipfsHash", "type": "string" }
        ],
        "name": "storeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const IssueCertificate = () => {
    const [studentName, setStudentName] = useState('');
    const [por, setPor] = useState('');
    const [society, setSociety] = useState('');

    const initializeWeb3 = async () => {
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
    };

    const handleIssueCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();

            if (!studentName || !por || !society) {
                alert('Please fill in all fields.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const isOrganisationRegistered = await contract.methods.checkOganisationExistence(userAccount).call();

            if (!isOrganisationRegistered) {
                alert('Your account is not registered as an organisation. Please register it first.');
                return;
            }

            const response = await fetch('http://localhost:3000/certificates/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, por, society })
            });

            if (!response.ok) throw new Error(await response.text());

            const { ipfsHash } = await response.json();
            const transaction = await contract.methods.storeCertificate(ipfsHash, userAccount).send({ from: userAccount });

            alert(`Certificate stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Issue Certificate</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Student Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    value={por}
                    onChange={(e) => setPor(e.target.value)}
                    placeholder="Position or Role"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    placeholder="Society"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    onClick={handleIssueCertificate}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                    Issue Certificate
                </button>
            </div>
        </div>
    );
};

export default IssueCertificate;
