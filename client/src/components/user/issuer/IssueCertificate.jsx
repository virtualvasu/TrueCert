import { useState } from 'react';
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
    const [inputMode, setInputMode] = useState('generate'); // 'generate' or 'cid'
    const [ipfsCid, setIpfsCid] = useState('');
    const [certificateDetails, setCertificateDetails] = useState({
        name: '',
        title: '',
        extra_info: ''
    });

    const handleTemplateChange = (templateName) => {
        setSelectedTemplate(templateName);
        const template = templates[templateName] || [];
        const initialState = template.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setFormValues(initialState);
    };

    const validateCID = (cid) => {
        // More lenient IPFS hash validation - matches what CheckCertificate uses
        return cid.length >= 40 && /^[a-zA-Z0-9]+$/.test(cid);
    };

    const handleCertificateDetailsChange = (field, value) => {
        setCertificateDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleIssueCertificate = async () => {
        try {
            const { web3, userAccount } = await initializeWeb3();

            // Apply checksum to the user account address
            const userAccountChecksum = web3.utils.toChecksumAddress(userAccount);

            // Validation for certificate details (required for both modes)
            if (!certificateDetails.name.trim() || !certificateDetails.title.trim()) {
                alert('Please fill in certificate name and title.');
                return;
            }

            // Validation based on input mode
            if (inputMode === 'generate') {
                if (Object.values(formValues).includes('')) {
                    alert('Please fill in all template fields.');
                    return;
                }
            } else if (inputMode === 'cid') {
                if (!ipfsCid.trim()) {
                    alert('Please enter an IPFS CID.');
                    return;
                }
                if (!validateCID(ipfsCid.trim())) {
                    alert('Please enter a valid IPFS hash (minimum 40 characters, alphanumeric).');
                    return;
                }
            }

            console.log('User Account:', userAccountChecksum);

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const isOrganisationRegistered = await contract.methods.checkOrganisationExistence(userAccountChecksum).call();

            if (!isOrganisationRegistered) {
                alert('Your account is not registered as an organisation. Please register it first.');
                return;
            }

            let ipfsHash;

            if (inputMode === 'generate') {
                // Generate certificate via server
                const serverURL = import.meta.env.VITE_SERVER_URL;
                const response = await fetch(`${serverURL}/certificates/issue`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formValues),
                });

                if (!response.ok) throw new Error(await response.text());

                const result = await response.json();
                ipfsHash = result.ipfsHash;
            } else {
                // Use provided CID
                ipfsHash = ipfsCid.trim();
            }

            // Store certificate on blockchain
            await contract.methods.storeCertificate(
                ipfsHash, 
                userAccountChecksum, 
                certificateDetails.name,
                certificateDetails.title,
                certificateDetails.extra_info
            ).send({ from: userAccountChecksum });

            if (inputMode === 'generate') {
                handleGenerateHTML({
                    ...formValues,
                    ipfsHash,
                    organisation: userAccountChecksum,
                });
            } else {
                alert(`Certificate successfully stored on blockchain with IPFS CID: ${ipfsHash}`);
            }
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
                        {/* Input Mode Selector */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Certificate Input Mode
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="generate"
                                        checked={inputMode === 'generate'}
                                        onChange={(e) => setInputMode(e.target.value)}
                                        className="mr-2"
                                    />
                                    Generate Certificate
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="cid"
                                        checked={inputMode === 'cid'}
                                        onChange={(e) => setInputMode(e.target.value)}
                                        className="mr-2"
                                    />
                                    Provide IPFS CID
                                </label>
                            </div>
                        </div>

                        {/* Certificate Details Fields */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700">Certificate Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="certName" className="block text-sm font-medium text-gray-700">
                                        Certificate Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="certName"
                                        value={certificateDetails.name}
                                        onChange={(e) => handleCertificateDetailsChange('name', e.target.value)}
                                        placeholder="e.g., Certificate of Achievement"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="certTitle" className="block text-sm font-medium text-gray-700">
                                        Certificate Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="certTitle"
                                        value={certificateDetails.title}
                                        onChange={(e) => handleCertificateDetailsChange('title', e.target.value)}
                                        placeholder="e.g., Web Development Course"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="certExtraInfo" className="block text-sm font-medium text-gray-700">
                                        Additional Information
                                    </label>
                                    <textarea
                                        id="certExtraInfo"
                                        value={certificateDetails.extra_info}
                                        onChange={(e) => handleCertificateDetailsChange('extra_info', e.target.value)}
                                        placeholder="e.g., Completed 40-hour course with distinction"
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {inputMode === 'generate' && (
                            <>
                                <TemplateSelector
                                    templates={templates}
                                    selectedTemplate={selectedTemplate}
                                    handleTemplateChange={handleTemplateChange}
                                />
                                {selectedTemplate && (
                                    <FormFields
                                        fields={templates[selectedTemplate]}
                                        formValues={formValues}
                                        handleChange={handleChange}
                                    />
                                )}
                            </>
                        )}

                        {inputMode === 'cid' && (
                            <div className="space-y-3">
                                <label htmlFor="ipfsCid" className="block text-sm font-medium text-gray-700">
                                    IPFS CID
                                </label>
                                <input
                                    type="text"
                                    id="ipfsCid"
                                    value={ipfsCid}
                                    onChange={(e) => setIpfsCid(e.target.value)}
                                    placeholder="Enter IPFS CID (e.g., QmXXXXXX... or bafXXXXXX...)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <p className="text-sm text-gray-500">
                                    Enter the IPFS CID of your certificate file. Supports both CIDv0 (starts with &apos;Qm&apos;) and CIDv1 (starts with &apos;baf&apos;) formats.
                                </p>
                            </div>
                        )}

                        {((inputMode === 'generate' && selectedTemplate) || (inputMode === 'cid')) && (
                            <button
                                onClick={handleIssueCertificate}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Issue Certificate
                            </button>
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
