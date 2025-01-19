import React, { useState } from 'react';
import useForm from '../issuer/sub_components/useForm';
import { initializeWeb3 } from '../../../utils/web3Utils';
import TemplateSelector from '../issuer/sub_components/TemplateSelector';
import FormFields from '../issuer/sub_components/FormFields';
import CertificatePreview from '../issuer/sub_components/CertificatePreview';
import { template1, template2 } from '../../../assets/issuer/docTemplates/templates';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { Award } from 'lucide-react';
import {jsPDF} from 'jspdf';

const IssueCertificate = () => {
    const templates = { template1, template2 };
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formValues, setFormValues, handleChange] = useForm({});
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

            // Apply checksum to the user account address
            const userAccountChecksum = web3.utils.toChecksumAddress(userAccount);

            if (Object.values(formValues).includes('')) {
                alert('Please fill in all fields.');
                return;
            }

            console.log('User Account:', userAccountChecksum);

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const isOrganisationRegistered = await contract.methods.checkOrganisationExistence(userAccountChecksum).call();

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
            await contract.methods.storeCertificate(ipfsHash, userAccountChecksum).send({ from: userAccountChecksum });

            handleGenerateHTML({
                ...formValues,
                ipfsHash,
                organisation: userAccountChecksum,
            });
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        }
    };


    const handleGenerateHTML = (data) => {
        // Create a new jsPDF instance
        const doc = new jsPDF();
    
        // Set the font for the PDF
        doc.setFont("Arial");
    
        // Add the title to the PDF
        doc.setFontSize(16);
        doc.text("Certificate of Achievement", 105, 20, null, null, 'center');
        doc.setFontSize(12);
    
        // Add the Issuer Organisation's Address and IPFS Hash
        doc.text(`Issuer Organisation's Address: ${data.organisation}`, 20, 30);
        doc.text(`IPFS Hash: ${data.ipfsHash}`, 20, 40);
    
        // Add other fields dynamically
        let yPosition = 50; // Initial y-position for the dynamic fields
        Object.keys(data).forEach((key) => {
            if (key !== 'organisation' && key !== 'ipfsHash') {
                const field = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${data[key]}`;
                doc.text(field, 20, yPosition);
                yPosition += 10; // Increment y-position for next field
            }
        });
    
        // Add the verification text at the bottom
        doc.setFontSize(10);
        doc.text("This certificate is verified on blockchain.", 105, yPosition, null, null, 'center');
    
        // Save the PDF and set the URL
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
                    {!pdfUrl && (
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
                    )}
                    {pdfUrl && <CertificatePreview pdfUrl={pdfUrl} onDownload={handleDownload} />}
                </div>
            </div>
        </div>
    );
};

export default IssueCertificate;
