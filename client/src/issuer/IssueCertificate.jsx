import React, { useState } from 'react';
import Web3 from 'web3';
import { template1, template2 } from '../../../assets/issuer/docTemplates/templates';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { Download, Eye, Award } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
    const [certificateData, setCertificateData] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');

    const handleTemplateChange = (templateName) => {
        setSelectedTemplate(templateName);
        const template = templates[templateName] || [];
        const initialState = template.reduce((acc, field) => {
            acc[field.name] = '';
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
            const response = await fetch(`${serverURL}/certificates/issue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) throw new Error(await response.text());

            const { ipfsHash } = await response.json();
            const transaction = await contract.methods.storeCertificate(ipfsHash, userAccount).send({ from: userAccount });

            setCertificateData({
                ...formValues,
                ipfsHash,
                organisation: userAccount,
            });

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

        // Create the certificate HTML content
        const certificateHTML = `
            <div style="border: 2px solid #006f9f; padding: 20px; width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h2 style="text-align: center; color: #006f9f;">Certificate of Achievement</h2>
                <hr style="border-top: 1px solid #006f9f; margin-bottom: 20px;">
                <p><strong>Issuer Organisation's Address:</strong> ${data.organisation}</p>
                <p><strong>IPFS Hash:</strong> ${data.ipfsHash}</p>
                <h3 style="text-align: center; color: #006f9f;">Certificate Data:</h3>
                ${Object.keys(data).map((key) => {
            if (key !== 'organisation' && key !== 'ipfsHash') {
                return `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[key]}</p>`;
            }
            return '';
        }).join('')}
                <p style="text-align: center; font-size: 12px; color: gray;">This certificate is verified on blockchain.</p>
            </div>
        `;

        // Generate PDF from HTML content
        const element = document.createElement('div');
        element.innerHTML = certificateHTML;

        const options = {
            margin: 0.5,
            filename: 'certificate.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
            html2pdf: { from: element },
        };

        html2pdf()
            .from(element)
            .set(options)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfUrl);
            });
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
                    <div className="space-y-6">
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
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                                >
                                    Issue Certificate
                                </button>
                            </>
                        )}
                    </div>

                    {pdfUrl && <CertificatePreview pdfUrl={pdfUrl} onDownload={handleDownload} />}
                </div>
            </div>
        </div>
    );
};

export default IssueCertificate;
