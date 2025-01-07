import React, { useState } from 'react';
import IssueCertificate from './components/organisation/IssueCertificate';
import CheckCertificate from './components/organisation/CheckCertificate';
import RevokeCertificate from './components/organisation/RevokeCertificate';
import StoreOrganisation from './components/organisation/StoreOrganisation';

function App() {
    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">TrueCert</h1>
            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={() => setActiveComponent('IssueCertificate')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Issue Certificate
                </button>
                <button
                    onClick={() => setActiveComponent('CheckCertificate')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Check Certificate
                </button>
                <button
                    onClick={() => setActiveComponent('RevokeCertificate')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Revoke Certificate
                </button>
                <button
                    onClick={() => setActiveComponent('StoreOrganisation')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Store Organisation
                </button>
            </div>
            <div className="bg-white p-4 rounded shadow">
                {activeComponent === 'IssueCertificate' && <IssueCertificate />}
                {activeComponent === 'CheckCertificate' && <CheckCertificate />}
                {activeComponent === 'RevokeCertificate' && <RevokeCertificate />}
                {activeComponent === 'StoreOrganisation' && <StoreOrganisation />}
            </div>
        </div>
    );
}

export default App;
