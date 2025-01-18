import React, { useState } from 'react';
import Web3 from 'web3';
import { template1, template2 } from '../../../assets/issuer/docTemplates/templates';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { Download, Award } from 'lucide-react';
import jsPDF from 'jspdf';

// Initialize Web3
const initializeWeb3 = async () => {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        throw new Error('MetaMask not found.');
    }
    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
        alert('MetaMask is not connected. Please connect your account.');
        throw new Error('No MetaMask account connected with TrueCert.');
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

// Template Selector Component
const TemplateSelector = ({ templates, selectedTemplate, handleTemplateChange }) => (
    <div className="mb-6">
        <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Template
        </label>
        <select
            value={selectedTemplate || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
        >
            <option value="" disabled>
                Choose a template
            </option>
            {Object.keys(templates).map((templateName) => (
                <option key={templateName} value={templateName}>
                    {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

// Form Fields Component
const FormFields = ({ fields, formValues, handleChange }) => (
    <div className="space-y-4">
        {fields.map((field) => (
            <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {field.placeholder}
                </label>
                <input
                    type={field.type}
                    name={field.name}
                    value={formValues[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
        ))}
    </div>
);

// Certificate Preview Component
const CertificatePreview = ({ pdfUrl, onDownload }) => (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        {pdfUrl && (
            <div>
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    style={{ border: 'none' }}
                    title="Certificate PDF"
                ></iframe>
                <div className="mt-4 text-center">
                    <button
                        onClick={onDownload}
                        className="py-2 px-4 bg-green-600 text-white rounded-md"
                    >
                        <Download className="h-5 w-5 mr-2" /> Download PDF
                    </button>
                </div>
            </div>
        )}
    </div>
);

const IssueCertificate = () => {
    const templates = { template1, template2 };
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formValues, setFormValues, handleChange] = useForm({});
    const [pdfUrl, setPdfUrl] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleTemplateChange = (templateName) => {
        setSelectedTemplate(templateName);
        const template = templates[templateName] || [];
        const initialState = template.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setFormValues(initialState);
    };

    const handleConfirm = async (confirm) => {
        if (confirm) {
            await handleIssueCertificate();
        } else {
            setFormValues({});
            setShowConfirmation(false);
        }
    };

    const handleIssueCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();

            if (Object.values(formValues).some((value) => value === '')) {
                alert('Please fill in all fields.');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const isOrganisationRegistered = await contract.methods.checkOrganisationExistence(userAccount).call();

            if (!isOrganisationRegistered) {
                alert('Your account is not registered as an organisation. Please register it first.');
                return;
            }

            // Simulated server response for IPFS hash
            const ipfsHash = 'QmExampleHash123456789';

            await contract.methods.storeCertificate(ipfsHash, userAccount).send({ from: userAccount });

            handleGenerateHTML({
                ...formValues,
                ipfsHash,
                organisation: userAccount,
            });
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    const handleGenerateHTML = (data) => {
        if (!data) {
            alert('No certificate data available to generate HTML.');
            return;
        }

        const doc = new jsPDF('landscape', 'px', 'a4');
        doc.setFontSize(22);
        doc.text('Certificate of Achievement', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Issuer Organisation's Address: ${data.organisation}`, 20, 100);
        doc.text(`IPFS Hash: ${data.ipfsHash}`, 20, 120);

        let yPosition = 160;
        Object.keys(data).forEach((key) => {
            if (key !== 'organisation' && key !== 'ipfsHash') {
                doc.text(`${key}: ${data[key]}`, 20, yPosition);
                yPosition += 20;
            }
        });

        const pdfBlob = doc.output('blob');
        setPdfUrl(URL.createObjectURL(pdfBlob));
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'certificate.pdf';
            link.click();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2">
                    <Award className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">Issue Certificate</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                   { !pdfUrl && <div className="space-y-6">
                        {<TemplateSelector
                            templates={templates}
                            selectedTemplate={selectedTemplate}
                            handleTemplateChange={handleTemplateChange}
                        />}
                        {selectedTemplate && !showConfirmation && (
                            <>
                                <FormFields
                                    fields={templates[selectedTemplate]}
                                    formValues={formValues}
                                    handleChange={handleChange}
                                />
                                <button
                                    onClick={() => setShowConfirmation(true)}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                                >
                                    Issue Certificate
                                </button>
                            </>
                        )}
                        {showConfirmation && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Confirm Details</h3>
                                {Object.entries(formValues).map(([key, value]) => (
                                    <p key={key}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                    </p>
                                ))}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleConfirm(true)}
                                        className="py-2 px-4 bg-green-600 text-white rounded-md"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => handleConfirm(false)}
                                        className="py-2 px-4 bg-red-600 text-white rounded-md"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>}
                    {pdfUrl && <CertificatePreview pdfUrl={pdfUrl} onDownload={handleDownload} />}
                </div>
            </div>
        </div>
    );
};

export default IssueCertificate;
