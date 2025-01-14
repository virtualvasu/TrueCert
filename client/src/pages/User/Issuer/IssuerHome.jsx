import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate from react-router-dom
import { FaCogs, FaUserCircle } from 'react-icons/fa'; // Import icons for Actions and Profile

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

  // Function to handle logout
  const handleLogout = () => {
    // Clear any session data or authentication tokens (if needed)
    localStorage.removeItem('authToken'); // Example, depending on how you manage authentication

    // Redirect to login page
    navigate('/user/issuer/login'); // Navigate to the login page
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen flex flex-col justify-between">
      {/* Header Section */}
      <header className="bg-blue-800 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">TrueCert</h1>
            <p className="text-lg mt-2 text-gray-200">
              Streamlining certificate management for issuers.
            </p>
          </div>
          <div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-white font-semibold py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="max-w-7xl mx-auto bg-white p-10 rounded-lg shadow-lg mt-8 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">Issuer Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your actions and profile seamlessly.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-12 mb-8">
          <button
            onClick={() => handleNavigation('Actions')}
            className={`flex items-center px-8 py-4 text-xl font-medium text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
              activeComponent === 'Actions'
                ? 'bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <FaCogs className="mr-3 text-2xl" />
            Actions
          </button>
          <button
            onClick={() => handleNavigation('Profile')}
            className={`flex items-center px-8 py-4 text-xl font-medium text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
              activeComponent === 'Profile'
                ? 'bg-green-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <FaUserCircle className="mr-3 text-2xl" />
            Profile
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          {activeComponent === 'Actions' ? (
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Issuer Actions
              </h2>
              {/* Replace with the actual component */}
              <p className="text-lg text-gray-600">
                Manage your certificate issuance actions. Control certificates, view issuance history, and take necessary actions for your organization.
              </p>
            </div>
          ) : activeComponent === 'Profile' ? (
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Issuer Profile
              </h2>
              {/* Replace with the actual component */}
              <p className="text-lg text-gray-600">
                Update your personal details, change settings, and manage account preferences in a few clicks.
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="text-lg">
                Select an option above to get started with managing your actions or profile.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-800 text-white p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white-600 text-md">
            Made with ❤️ by <span className="font-bold text-white">Vasu</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default IssuerHome;
