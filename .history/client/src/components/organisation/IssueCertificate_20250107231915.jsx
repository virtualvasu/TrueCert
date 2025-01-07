import React, { useState } from 'react';
import Web3 from 'web3';

const contractAddress = '0x8f5f84d66D04BcAe4DdBfe4F7939Ef46B4639880'; // Replace with your contract address

const contractABI = [
    // Include your contract ABI here
];

const IssueCertificate = () => {
    const [studentName, setStudentName] = useState('');
    const [por, setPor] = useState('');
    const [society, setSociety] = useState('');

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

    const handleIssueCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();
            if (!studentName || !por || !society) {
                alert('Please fill in all fields.');
                return;
            }
            const orgAddress = userAccount;
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const isOrganisationRegistered = await contract.methods.checkOganisationExistence(orgAddress).call();
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
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Issue Certificate</h2>
            <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student Name" required />
            <input type="text" value={por} onChange={(e) => setPor(e.target.value)} placeholder="Position or Role" required />
            <input type="text" value={society} onChange={(e) => setSociety(e.target.value)} placeholder="Society" required />
            <button onClick={handleIssueCertificate}>Issue Certificate</button>
        </div>
    );
};

export default IssueCertificate;
