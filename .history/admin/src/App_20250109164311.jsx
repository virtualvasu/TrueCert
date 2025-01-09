import './App.css';
import { useState } from 'react';
import StoreOrganisation from './components/StoreOrganisation';
import CheckOrganisation from './components/CheckOrganisation';

function App() {
  const [isStoreOrganisationVisible, setIsStoreOrganisationVisible] = useState(false);
  const [isCheckOrganisationVisible, setIsCheckOrganisationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowStoreOrganisation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsStoreOrganisationVisible(true);
      setIsCheckOrganisationVisible(false); // Hide CheckOrganisation
      setIsLoading(false);
    }, 1500);
  };

  const handleShowCheckOrganisation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsCheckOrganisationVisible(true);
      setIsStoreOrganisationVisible(false); // Hide StoreOrganisation
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <header className="bg-blue-600 text-white p-8 shadow-xl">
                <div className="max-w-6xl mx-auto text-center">
                <header className="bg-blue-600 text-white p-8 shadow-xl">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        TrueCert
                    </h1>
                    <p className="text-xl mt-2 text-gray-200">
                        Streamlining certificate management for organisations.
                    </p>
                </div>
            </header>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        TrueCert
                    </h1>
                    <p className="text-xl mt-2 text-gray-200">
                        Streamlining certificate management for organisations.
                    </p>
                </div>
            </header>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Buttons to toggle components */}
        {!isStoreOrganisationVisible && !isCheckOrganisationVisible && (
          <div className="space-y-4">
            <button
              onClick={handleShowStoreOrganisation}
              className="w-full px-8 py-4 text-xl font-semibold text-white bg-yellow-500 rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-600"
            >
              Store Organisation
            </button>
            <button
              onClick={handleShowCheckOrganisation}
              className="w-full px-8 py-4 text-xl font-semibold text-white bg-indigo-500 rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-600"
            >
              Check Organisation
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="w-16 h-16 border-t-4 border-yellow-600 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl text-gray-800">Loading...</p>
          </div>
        )}

        {/* Store Organisation Component */}
        {!isLoading && isStoreOrganisationVisible && (
          <div className="mt-8">
            <StoreOrganisation />
          </div>
        )}

        {/* Check Organisation Component */}
        {!isLoading && isCheckOrganisationVisible && (
          <div className="mt-8">
            <CheckOrganisation />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
