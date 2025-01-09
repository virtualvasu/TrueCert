import React, { useState } from 'react';
import OrgHome from './components/organisation/OrgHome';
import UserHome from './components/user/UserHome';

function App() {
  const [showOrgHome, setShowOrgHome] = useState(false);
  const [showUserContent, setShowUserContent] = useState(false);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex flex-col">
      {!showOrgHome && !showUserContent ? (
        <>
          <header className="bg-orange-600 text-white py-8 shadow-md">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold tracking-tight">
                Welcome to TrueCert
              </h1>
              <p className="text-lg mt-2 text-orange-200">
                Simplify certificate management with ease.
              </p>
            </div>
          </header>
          <main className="flex-grow flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-xl text-center">
              <div className="flex justify-center space-x-8">
                <button
                  onClick={() => setShowOrgHome(true)}
                  className="px-10 py-4 font-medium text-white bg-orange-600 rounded-lg shadow-md hover:bg-orange-700 transition-all duration-300"
                >
                  Organisation
                </button>
                <button
                  onClick={() => setShowUserContent(true)}
                  className="px-10 py-4 font-medium text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
                >
                  User
                </button>
              </div>
            </div>
          </main>
          <footer className="bg-orange-600 text-white py-4">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-sm">
                &copy; 2025 TrueCert. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      ) : showOrgHome ? (
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
            <OrgHome />
          </div>
        </div>
      ) : (
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              User Content
            </h2>
            <UserHome />
            
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
