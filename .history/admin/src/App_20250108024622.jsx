import './App.css';
import { useState } from 'react';
import StoreOrganisation from './components/StoreOrganisation'; // Ensure this is correctly imported

function App() {
  const [isStoreOrganisationVisible, setIsStoreOrganisationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowStoreOrganisation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsStoreOrganisationVisible(true);
      setIsLoading(false); // Set loading to false once the component is shown
    }, 1500); // Simulating loading delay
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        <button
          onClick={handleShowStoreOrganisation}
          className={`w-full px-8 py-4 text-xl font-semibold text-white rounded-lg shadow-md transition-all duration-300 ${isStoreOrganisationVisible
            ? 'bg-yellow-600'
            : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
        >
          Store Organisation
        </button>

        {
          isLoading ? (
            <div className="mt-8 text-center">
              <div className="w-16 h-16 border-t-4 border-yellow-600 border-solid rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-xl text-gray-800">Loading...</p>
            </div>
          ) : isStoreOrganisationVisible && (
            <div className="mt-8">
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Register New Organisation
              </h2>
              <StoreOrganisation /> {/* Use StoreOrganisation here */}
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
