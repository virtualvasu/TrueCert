import React, { useState } from 'react';
import IssueCertificate from './components/organisation/IssueCertificate';
import CheckCertificate from './components/organisation/CheckCertificate';
import RevokeCertificate from './components/organisation/RevokeCertificate';
import StoreOrganisation from './components/organisation/StoreOrganisation';

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto shadow-lg bg-white rounded-lg overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6">
          <h1 className="text-4xl font-extrabold text-center text-white">TrueCert</h1>
          <p className="text-center text-white mt-2 text-sm">
            A streamlined platform for managing certificates
          </p>
        </header>
        <main className="p-6">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveComponent('IssueCertificate')}
              className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition ${activeComponent === 'IssueCertificate'
                  ? 'bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              Issue Certificate
            </button>
            <button
              onClick={() => setActiveComponent('CheckCertificate')}
              className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition ${activeComponent === 'CheckCertificate'
                  ? 'bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              Check Certificate
            </button>
            <button
              onClick={() => setActiveComponent('RevokeCertificate')}
              className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition ${activeComponent === 'RevokeCertificate'
                  ? 'bg-red-700'
                  : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              Revoke Certificate
            </button>
            <button
              onClick={() => setActiveComponent('StoreOrganisation')}
              className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition ${activeComponent === 'StoreOrganisation'
                  ? 'bg-yellow-700'
                  : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
            >
              Store Organisation
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            {activeComponent === 'IssueCertificate' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Issue Certificate
                </h2>
                <IssueCertificate />
              </div>
            )}
            {activeComponent === 'CheckCertificate' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Check Certificate
                </h2>
                <CheckCertificate />
              </div>
            )}
            {activeComponent === 'RevokeCertificate' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Revoke Certificate
                </h2>
                <RevokeCertificate />
              </div>
            )}
            {activeComponent === 'StoreOrganisation' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Store Organisation
                </h2>
                <StoreOrganisation />
              </div>
            )}
            {!activeComponent && (
              <p className="text-gray-600 text-center">
                Select an action to get started.
              </p>
            )}
          </div>
        </main>
        <footer className="bg-gray-100 p-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 TrueCert. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
