import React, { useState } from 'react';
import Web3 from 'web3';

import { contractAddress, contractABI } from '../../assets/contractDetails';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS;

const RevokeOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function initializeWeb3() {
        if (typeof window.ethereum === 'undefined') {
            setMessage('MetaMask is not installed. Please install MetaMask to proceed.');
            throw new Error('MetaMask not found.');
        }
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            setMessage('MetaMask is not connected. Please connect your account.');
            throw new Error('No MetaMask account connected.');
        }
        return { web3, userAccount: accounts[0] };
    }

    async function handleRevokeOrganisation() {
        try {
            setIsLoading(true);
            const { web3, userAccount } = await initializeWeb3();

            if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
                setMessage('You must be the admin to revoke the organisation. Please switch to the admin account.');
                setIsLoading(false);
                return;
            }

            if (!orgAddress) {
                setMessage('Please enter an organisation address.');
                setIsLoading(false);
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const transaction = await contract.methods.revokeOrganisation(orgAddress).send({ from: userAccount });

            setMessage(`Organisation revoked from the blockchain! Transaction Hash: ${transaction.transactionHash}`);
            setOrgAddress('');
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error.message);
            setMessage(`Error: ${error.message}`);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-xl mx-auto">
            <Card className="w-full bg-white border border-indigo-500 rounded-xl shadow-xl">
                <CardHeader className="bg-indigo-500 text-white p-6 rounded-t-xl">
                    <CardTitle className="text-4xl font-semibold text-center">Revoke Organisation</CardTitle>
                    <CardDescription className="text-center text-lg text-white">
                        Revoke an organisation's access to the blockchain.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                    {message && (
                        <p
                            className={`text-center mb-4 font-medium ${
                                message.includes('Error') ? 'text-red-500' : 'text-indigo-500'
                            }`}
                        >
                            {message}
                        </p>
                    )}
                    <div className="mb-4">
                        <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-800 mb-2">
                            Organisation Address
                        </label>
                        <Input
                            id="orgAddress"
                            value={orgAddress}
                            onChange={(e) => setOrgAddress(e.target.value)}
                            className="w-full bg-gray-100 text-gray-800 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
                            placeholder="Enter organisation address"
                        />
                    </div>
                    <Button
                        onClick={handleRevokeOrganisation}
                        className="w-full bg-red-500 text-white py-4 px-6 rounded-lg shadow-lg hover:bg-red-600 transition-all duration-300"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                        ) : (
                            'Revoke Organisation'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default RevokeOrganisation;
