import React, { useState } from 'react';
import { FaCertificate, FaSearch, FaBan } from 'react-icons/fa'; // Import icons
import IssueCertificate from '../../../components/user/issuer/IssueCertificate';
import CheckCertificate from '../../../components/user/issuer/CheckCertificate';
import RevokeCertificate from '../../../components/user/issuer/RevokeCertificate';
import TrueCert_logo from '../../../assets/TrueCert_logo.svg'; // Import the logo
import { useNavigate } from 'react-router-dom'; // To handle navigation

function IssuerActions() {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate(); // Navigate function for logout

  // Function to handle logout
  const handleLogout = () => {
    // Logic for logging out (could clear user data, etc.)
    navigate('/user/issuer/login'); // Navigate to the login page
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto shadow-lg bg-white rounded-xl overflow-hidden">
        {/* Header Section with Logo and Branding */}
        <header className="bg-blue-600 text-white p-6 shadow-md">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* TrueCert Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={TrueCert_logo} // Use the imported logo here
                alt="TrueCert Logo"
                className="h-20 w-20 rounded-full object-cover"
              />

              <h1 className="text-3xl font-extrabold">TrueCert</h1>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-800">Issuer Dashboard</h1>
            <p className="text-lg text-gray-500 mt-2">Manage your certificate issuance with ease</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mb-10">
            <button
              onClick={() => setActiveComponent('IssueCertificate')}
              className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${activeComponent === 'IssueCertificate'
                  ? 'bg-indigo-600 scale-105'
                  : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
            >
              <FaCertificate className="inline-block mr-2" />
              Issue Certificate
            </button>
            <button
              onClick={() => setActiveComponent('CheckCertificate')}
              className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${activeComponent === 'CheckCertificate'
                  ? 'bg-green-600 scale-105'
                  : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              <FaSearch className="inline-block mr-2" />
              Check Certificate
            </button>
            <button
              onClick={() => setActiveComponent('RevokeCertificate')}
              className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${activeComponent === 'RevokeCertificate'
                  ? 'bg-red-600 scale-105'
                  : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              <FaBan className="inline-block mr-2" />
              Revoke Certificate
            </button>
          </div>

          {/* Displaying Active Component */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-xl">
            {activeComponent === 'IssueCertificate' && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Issue a New Certificate</h2>
                <IssueCertificate />
              </div>
            )}
            {activeComponent === 'CheckCertificate' && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Check Existing Certificates</h2>
                <CheckCertificate />
              </div>
            )}
            {activeComponent === 'RevokeCertificate' && (
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Revoke a Certificate</h2>
                <RevokeCertificate />
              </div>
            )}
            {!activeComponent && (
              <p className="text-center text-lg text-gray-600">
                Select an action above to get started.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default IssuerActions;
