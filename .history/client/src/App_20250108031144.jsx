import React, { useState } from 'react';
import OrgActions from './components/organisation/OrgHome';

function App() {
  const [showOrgHome, setShowOrgHome] = useState(false);
  const [showUserContent, setShowUserContent] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-8 shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">
            TrueCert
          </h1>
          <p className="text-xl mt-2 text-gray-200">
            Streamlining certificate management for organisations and users.
          </p>
        </div>
      </header>
      <main className="flex-grow p-6">
        {!showOrgHome && !showUserContent ? (
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Welcome to TrueCert!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              TrueCert is a platform designed to simplify and streamline certificate management for both organisations and individual users.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setShowOrgHome(true)}
                className="px-8 py-4 font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              >
                Organisation
              </button>
              <button
                onClick={() => setShowUserContent(true)}
                className="px-8 py-4 font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
              >
                User
              </button>
            </div>
          </div>
        ) : showOrgHome ? (
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
            <OrgHome />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              User Content
            </h2>
            <p className="text-gray-600">
              This is some sample content for the user. You can implement further functionality here.
            </p>
          </div>
        )}
      </main>
      <footer className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 TrueCert. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
