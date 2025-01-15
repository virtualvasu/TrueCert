import React, { useState } from 'react';
import Web3 from 'web3';
import jsPDF from 'jspdf';
import { template1, template2 } from '../../../assets/issuer/docTemplates/templates'; // Import your templates
import { contractAddress, contractABI } from '../../../assets/contractDetails';

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
    const [certificateData, setCertificateData] = useState(null);

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
            const serverURL = import.meta.env.VITE_SERVER_URL;
            const response = await fetch(`${serverURL}/certificates/issue`, { // Use backticks here
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
            });


            if (!response.ok) throw new Error(await response.text());

            const { ipfsHash } = await response.json();
            const transaction = await contract.methods.storeCertificate(ipfsHash, userAccount).send({ from: userAccount });

            alert(`Certificate stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);

            // Save certificate data for PDF generation
            setCertificateData({
                ...formValues,
                ipfsHash,
                organisation: userAccount,
            });
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };

    const handleGeneratePDF = () => {
        if (!certificateData) {
            alert('No certificate data available to generate PDF.');
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Gradient-like background
        const colors = [
            [240, 248, 255], // Light blue
            [173, 216, 230], // Sky blue
            [255, 255, 255]  // White
        ];

        for (let i = 0; i < colors.length; i++) {
            doc.setFillColor(...colors[i]);
            doc.rect(0, (pageHeight / colors.length) * i, pageWidth, pageHeight / colors.length, 'F');
        }

        // Decorative border
        doc.setDrawColor(0, 128, 255);
        doc.setLineWidth(5);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        // Title
        doc.setFont('Times', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(0, 51, 102);
        doc.text('Certificate of Achievement', pageWidth / 2, 60, { align: 'center' });

        // Subtitle
        doc.setFont('Times', 'italic');
        doc.setFontSize(20);
        doc.setTextColor(50, 50, 50);
        doc.text('Awarded for Excellence and Dedication', pageWidth / 2, 80, { align: 'center' });

        // Add watermark
        doc.setFontSize(60);
        doc.setTextColor(200, 200, 200);
        doc.text('DRAFT', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });

        // Organisation Name
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text(`Organisation: ${certificateData.organisation}`, 20, 110);

        // IPFS hash
        doc.setFontSize(14);
        doc.setTextColor(80, 80, 80);
        doc.text(`IPFS Hash: ${certificateData.ipfsHash}`, 20, 130);

        // Table-like section for other fields
        const fieldStartY = 150;
        const fieldPadding = 5;
        const fieldHeight = 10;

        Object.entries(certificateData).forEach(([key, value], index) => {
            if (key !== 'ipfsHash' && key !== 'organisation') {
                const y = fieldStartY + index * (fieldHeight + fieldPadding);
                // Row background color
                doc.setFillColor(index % 2 === 0 ? 220 : 240, 240, 255);
                doc.rect(15, y - fieldPadding / 2, pageWidth - 30, fieldHeight + fieldPadding / 2, 'F');

                // Text
                doc.setTextColor(0);
                doc.setFontSize(12);
                doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 25, y + (fieldHeight / 2));
                doc.text(value.toString(), pageWidth / 2, y + (fieldHeight / 2), { align: 'left' });
            }
        });

        // Footer
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.text(
            'This certificate is digitally signed and secured using blockchain technology.',
            pageWidth / 2,
            pageHeight - 30,
            { align: 'center' }
        );

        // Save the PDF
        doc.save('certificate.pdf');
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
                    {certificateData && (
                        <button
                            onClick={handleGeneratePDF}
                            className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        >
                            Download Certificate PDF
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default IssueCertificate;