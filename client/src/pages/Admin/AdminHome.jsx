import React, { useState } from 'react';
import StoreOrganisation from '../../components/admin/StoreOrganisation';
import CheckOrganisation from '../../components/admin/CheckOrganisation';
import RevokeOrganisation from '../../components/admin/RevokeOrganisation';

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState(null); // State to track the active section
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to show a section based on the clicked button
  const handleShowSection = (section) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden">
        <header className="bg-blue-600 text-white p-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">TrueCert</h1>
            <p className="text-lg mt-2 text-gray-200">
              Streamlining certificate management for organisations.
            </p>
          </div>
        </header>

        <div className="p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Admin Dashboard</h2>

          {/* Buttons to toggle components */}
          {!activeSection && !isLoading && (
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleShowSection('store')}
                className="w-full px-6 py-4 text-lg font-medium text-white bg-yellow-500 rounded-lg shadow-lg transition-transform duration-300 hover:bg-yellow-600 hover:scale-105"
              >
                Store Organisation
              </button>
              <button
                onClick={() => handleShowSection('check')}
                className="w-full px-6 py-4 text-lg font-medium text-white bg-indigo-500 rounded-lg shadow-lg transition-transform duration-300 hover:bg-indigo-600 hover:scale-105"
              >
                Check Organisation
              </button>
              <button
                onClick={() => handleShowSection('revoke')}
                className="w-full px-6 py-4 text-lg font-medium text-white bg-red-500 rounded-lg shadow-lg transition-transform duration-300 hover:bg-red-600 hover:scale-105"
              >
                Revoke Organisation
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-yellow-600 border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-gray-700">Loading...</p>
            </div>
          )}

          {/* Display active section */}
          {!isLoading && activeSection === 'store' && (
            <div className="mt-8">
              <StoreOrganisation />
            </div>
          )}

          {!isLoading && activeSection === 'check' && (
            <div className="mt-8">
              <CheckOrganisation />
            </div>
          )}

          {!isLoading && activeSection === 'revoke' && (
            <div className="mt-8">
              <RevokeOrganisation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
