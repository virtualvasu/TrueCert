import React, { useState } from 'react';
import Web3 from 'web3';

const contractAddress = '0x8f5f84d66D04BcAe4DdBfe4F7939Ef46B4639880'; // Replace with your contract address

const contractABI = [
    // Include your contract ABI here
];

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
        <div>
            <h2>Check Certificate Existence</h2>
            <input type="text" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} placeholder="IPFS Hash" required />
            <button onClick={handleCheckCertificate}>Check Certificate</button>
        </div>
    );
};

export default CheckCertificate;
