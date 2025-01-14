import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react'; // Import ArrowRight icon from lucide-react
import StoreOrganisation from '../../components/admin/StoreOrganisation';
import CheckOrganisation from '../../components/admin/CheckOrganisation';
import RevokeOrganisation from '../../components/admin/RevokeOrganisation';

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowSection = (section) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveSection(null);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
        <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <ArrowRight className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">TrueCert</h1>
            <p className="text-lg mt-2 text-blue-100">
              Blockchain-Powered Certificate Management
            </p>
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-white">Admin Dashboard</h2>
            {activeSection && !isLoading && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white bg-blue-800 bg-opacity-50 rounded-lg transition-all duration-300 hover:bg-opacity-70"
              >
                ← Back to Menu
              </button>
            )}
          </div>

          {/* Main Menu Buttons */}
          {!activeSection && !isLoading && (
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleShowSection('store')}
                className="group relative w-full p-6 text-left bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <h3 className="text-xl font-bold text-white mb-2">Store Organisation</h3>
                <p className="text-yellow-100">Add new organizations to the blockchain network</p>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </button>

              <button
                onClick={() => handleShowSection('check')}
                className="group relative w-full p-6 text-left bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <h3 className="text-xl font-bold text-white mb-2">Check Organisation</h3>
                <p className="text-indigo-100">Verify organization credentials and status</p>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </button>

              <button
                onClick={() => handleShowSection('revoke')}
                className="group relative w-full p-6 text-left bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <h3 className="text-xl font-bold text-white mb-2">Revoke Organisation</h3>
                <p className="text-red-100">Remove organization access and certificates</p>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-100 rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-blue-100">Loading...</p>
            </div>
          )}

          {/* Active Section Components */}
          {!isLoading && activeSection === 'store' && (
            <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
              <StoreOrganisation />
            </div>
          )}

          {!isLoading && activeSection === 'check' && (
            <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
              <CheckOrganisation />
            </div>
          )}

          {!isLoading && activeSection === 'revoke' && (
            <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
              <RevokeOrganisation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
