import React, { useState } from 'react';
import OrgHome from './components/organisation/OrgHome';

function App() {
  const [showOrgHome, setShowOrgHome] = useState(false);
  const [showUserContent, setShowUserContent] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center">TrueCert</h1>
        <p className="text-center text-sm mt-2">Streamlining certificate management</p>
      </header>
      <main className="flex justify-center items-center p-6">
        {!showOrgHome && !showUserContent ? (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Welcome to TrueCert!
            </h2>
            <p className="text-gray-600 mb-6">
              TrueCert is a platform designed to simplify and streamline certificate management.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setShowOrgHome(true)}
                className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 mb-4 md:mb-0"
              >
                Organisation
              </button>
              <button
                onClick={() => setShowUserContent(true)}
                className="px-6 py-3 font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
              >
                User
              </button>
            </div>
          </div>
        ) : showOrgHome ? (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <OrgHome />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              User Content
            </h2>
            <p className="text-gray-600">
              This is some sample content for the user. You can implement further functionality here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
