import React, { useState } from 'react';

import { initializeWeb3 } from '../../utils/web3Utils';
import { contractAddress, contractABI } from '../../assets/contractDetails';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

const adminAddress = import.meta.env.VITE_ADMIN_PUBLIC_ADDRESS;

const StoreOrganisation = () => {
    const [orgAddress, setOrgAddress] = useState('');
    const [orgName, setOrgName] = useState('');
    const [message, setMessage] = useState('');


    async function handleStoreOrganisation() {
        try {
            const { web3, userAccount } = await initializeWeb3();

            if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
                setMessage('You must be the admin to store the organisation. Please switch to the admin account.');
                return;
            }

            if (!orgAddress || !orgName) {
                setMessage('Please fill in both fields.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const transaction = await contract.methods.storeOrganisation(orgAddress, orgName).send({ from: userAccount });

            setMessage(`Organisation stored on blockchain! `);
        } catch (error) {
            console.error('Error:', error.message);
            setMessage(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl">
            <div className="w-full max-w-md bg-indigo-50 bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
                <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
                    <h2 className="text-3xl font-bold text-center">Store Organisation</h2>
                </header>

                <div className="p-6">
                    {message && (
                        <Alert variant = "destructive" className="text-center mb-4">
                            {message}
                        </Alert>
                    )}
                    <div className="mb-4">
                        <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-800 mb-2">
                            Organisation Address
                        </label>
                        <Input
                            id="orgAddress"
                            value={orgAddress}
                            onChange={(e) => setOrgAddress(e.target.value)}
                            placeholder="Enter organisation address"
                            className="w-full text-gray-800 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="orgName" className="block text-sm font-medium text-gray-800 mb-2">
                            Organisation Name
                        </label>
                        <Input
                            id="orgName"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Enter organisation name"
                            className="w-full text-gray-800 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <Button
                        onClick={handleStoreOrganisation}
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-lg font-semibold"
                    >
                        Store Organisation
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StoreOrganisation;
