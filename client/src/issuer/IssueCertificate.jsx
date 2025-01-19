import React, { useState } from 'react';
import useForm from '../components/user/issuer/sub_components/useForm';
import initializeWeb3 from '../utils/web3Utils';
import TemplateSelector from '../components/user/issuer/sub_components/TemplateSelector';
import FormFields from '../components/user/issuer/sub_components/FormFields';
import CertificatePreview from '../components/user/issuer/sub_components/CertificatePreview';
import { template1, template2 } from '../../../assets/issuer/docTemplates/templates';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import { Award } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
        const certificateHTML = `
            <div style="border: 2px solid #006f9f; padding: 20px; width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h2 style="text-align: center; color: #006f9f;">Certificate of Achievement</h2>
                <hr style="border-top: 1px solid #006f9f; margin-bottom: 20px;">
                <p><strong>Issuer Organisation's Address:</strong> ${data.organisation}</p>
                <p><strong>IPFS Hash:</strong> ${data.ipfsHash}</p>
                ${Object.keys(data).map((key) =>
                    key !== 'organisation' && key !== 'ipfsHash'
                        ? `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[key]}</p>`
                        : ''
                ).join('')}
                <p style="text-align: center; font-size: 12px; color: gray;">This certificate is verified on blockchain.</p>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = certificateHTML;

        html2pdf()
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const pdfBlob = pdf.output('blob');
                setPdfUrl(URL.createObjectURL(pdfBlob));
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
