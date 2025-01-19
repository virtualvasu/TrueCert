import React, { useState } from 'react';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { initializeWeb3, revokeCertificate } from '../utils/web3Utils';

const RevokeCertificate = () => {
    const [revokeIpfsHash, setRevokeIpfsHash] = useState('');

    const handleRevokeCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();
            const transactionHash = await revokeCertificate(
                web3,
                contractABI,
                contractAddress,
                revokeIpfsHash,
                userAccount
            );
            alert(`Certificate revoked! Transaction Hash: ${transactionHash}`);
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
