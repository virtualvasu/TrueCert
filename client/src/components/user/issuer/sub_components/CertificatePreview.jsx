import React from 'react';
import { Download } from 'lucide-react';

const CertificatePreview = ({ pdfUrl, onDownload }) => (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        {pdfUrl && (
            <div>
                <iframe
                    src={pdfUrl}
                    width="200%"
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

export default CertificatePreview;
