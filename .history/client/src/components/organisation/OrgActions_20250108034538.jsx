import React, { useState } from 'react';
import IssueCertificate from './actions/CheckCertificate';
import CheckCertificate from './actions/IssueCertificate';
import RevokeCertificate from './actions/RevokeCertificate';

function OrgActions() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 ">
      <div className="max-w-4xl mx-auto shadow-lg bg-white rounded-lg overflow-hidden">
        
        <main className="p-6">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveComponent('IssueCertificate')}
              className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 ${
                activeComponent === 'IssueCertificate'
                  ? 'bg-blue-700 transform scale-105'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Issue Certificate
            </button>
            <button
              onClick={() => setActiveComponent('CheckCertificate')}
              className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 ${
                activeComponent === 'CheckCertificate'
                  ? 'bg-green-700 transform scale-105'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              Check Certificate
            </button>
            <button
              onClick={() => setActiveComponent('RevokeCertificate')}
              className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 ${
                activeComponent === 'RevokeCertificate'
                  ? 'bg-red-700 transform scale-105'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Revoke Certificate
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            {activeComponent === 'IssueCertificate' && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Issue Certificate</h2>
                <IssueCertificate />
              </div>
            )}
            {activeComponent === 'CheckCertificate' && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Check Certificate</h2>
                <CheckCertificate />
              </div>
            )}
            {activeComponent === 'RevokeCertificate' && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Revoke Certificate</h2>
                <RevokeCertificate />
              </div>
            )}
            {!activeComponent && (
              <p className="text-center text-lg text-gray-600">
                Select an action to get started.
              </p>
            )}
          </div>
        </main>
        
      </div>
    </div>
  );
}

export default OrgActions;
