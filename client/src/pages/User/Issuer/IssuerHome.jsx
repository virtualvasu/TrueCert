import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate from react-router-dom

function IssuerHome() {
  const navigate = useNavigate(); // Initialize navigate function
  const [activeComponent, setActiveComponent] = useState(null);

  // Function to handle navigation and set active component
  const handleNavigation = (component) => {
    setActiveComponent(component);
    if (component === 'Actions') {
      navigate('/user/issuer/actions'); // Navigate to actions page
    } else if (component === 'Profile') {
      navigate('/user/issuer/profile'); // Navigate to profile page
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-blue-600 text-white p-8 shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">TrueCert</h1>
          <p className="text-xl mt-2 text-gray-200">
            Streamlining certificate management for issuers.
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg mt-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600">Issuer Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your actions and profile with ease.
          </p>
        </header>
        <div className="flex justify-center space-x-6 mb-8">
          <button
            onClick={() => handleNavigation('Actions')}
            className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all duration-300 ${
              activeComponent === 'Actions'
                ? 'bg-blue-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Actions
          </button>
          <button
            onClick={() => handleNavigation('Profile')}
            className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all duration-300 ${
              activeComponent === 'Profile'
                ? 'bg-green-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Profile
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          {activeComponent === 'Actions' ? (
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Issuer Actions
              </h2>
              {/* Replace with the actual component */}
            </div>
          ) : activeComponent === 'Profile' ? (
            <div>
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Issuer Profile
              </h2>
              {/* Replace with the actual component */}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg">
                Please select an option above to get started.
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-blue-600 text-white p-4 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white-600 text-md">
            Made with ❤️ by <span className="font-bold text-white-600">{'Vasu'}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default IssuerHome;
