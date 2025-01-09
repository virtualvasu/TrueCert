import React, { useState } from 'react';
import Web3 from 'web3';
import { template1, template2 } from '../profile/docTemplates/templates'; // Import your templates
import { contractAddress, contractABI } from './contractDetails';

// Utility functions
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
    return { web3, userAccount: web3.utils.toChecksumAddress(accounts[0]) };
};

// Custom hook for form state management
const useForm = (initialState) => {
    const [formValues, setFormValues] = useState(initialState);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    return [formValues, setFormValues, handleChange];
};

// Component for template selection
const TemplateSelector = ({ templates, selectedTemplate, handleTemplateChange }) => (
    <div className="mb-4">
        <label htmlFor="template" className="block text-sm font-medium text-gray-700">Select Template</label>
        <select
            id="template"
            value={selectedTemplate || ''}
            onChange={handleTemplateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Choose a template</option>
            {Object.keys(templates).map((templateName) => (
                <option key={templateName} value={templateName}>
                    {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

// Component for rendering form fields
const FormFields = ({ fields, formValues, handleChange }) => (
    <div className="space-y-4">
        {fields.map((field) => (
            <input
                key={field.name}
                type={field.type}
                name={field.name}
                value={formValues[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        ))}
    </div>
);

const IssueCertificate = () => {
    const templates = { template1, template2 };
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formValues, setFormValues, handleChange] = useForm({});

    const handleTemplateChange = (e) => {
        const templateName = e.target.value;
        setSelectedTemplate(templateName);
        const template = templates[templateName] || [];
        const initialState = template.reduce((acc, field) => {
            acc[field.name] = ''; // Initialize each field to an empty string
            return acc;
        }, {});
        setFormValues(initialState);
    };

    const handleIssueCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();

            if (Object.values(formValues).includes('')) {
                alert('Please fill in all fields.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const isOrganisationRegistered = await contract.methods.checkOrganisationExistence(userAccount).call();

            if (!isOrganisationRegistered) {
                alert('Your account is not registered as an organisation. Please register it first.');
                return;
            }

            const response = await fetch('http://localhost:3000/certificates/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
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
            <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                handleTemplateChange={handleTemplateChange}
            />
            {selectedTemplate && (
                <>
                    <FormFields
                        fields={templates[selectedTemplate]}
                        formValues={formValues}
                        handleChange={handleChange}
                    />
                    <button
                        onClick={handleIssueCertificate}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                        Issue Certificate
                    </button>
                </>
            )}
        </div>
    );
};

export default IssueCertificate;
