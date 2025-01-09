import React, { useState } from 'react';
import OrgActions from './OrgActions';
import OrgProfile from './OrgProfile';

function OrgHome() {
    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-extrabold text-blue-600">
                    Organisation Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your organisation's actions and profile with ease.
                </p>
            </header>
            <div className="flex justify-center space-x-6 mb-8">
                <button
                    onClick={() => setActiveComponent('Actions')}
                    className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all duration-300 ${
                        activeComponent === 'Actions'
                            ? 'bg-blue-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    Actions
                </button>
                <button
                    onClick={() => setActiveComponent('Profile')}
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
                            Organisation Actions
                        </h2>
                        <OrgActions />
                    </div>
                ) : activeComponent === 'Profile' ? (
                    <div>
                        <h2 className="text-2xl font-semibold text-green-600 mb-4">
                            Organisation Profile
                        </h2>
                        <OrgProfile />
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="text-lg">Please select an option above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrgHome;
