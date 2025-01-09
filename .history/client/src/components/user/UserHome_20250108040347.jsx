import React, { useState } from "react";
import UserActions from "./UserActions";
import UserProfile from "./UserProfile";

function UserHome() {
    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex flex-col">
            {/* Header Section */}
            <header className="bg-orange-600 text-white p-8 shadow-xl">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        User Dashboard
                    </h1>
                    <p className="text-lg mt-2 text-gray-200">
                        Manage your actions and profile seamlessly.
                    </p>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                    {/* Navigation Buttons */}
                    <div className="flex justify-center space-x-6 mb-8">
                        <button
                            onClick={() => setActiveComponent('UserActions')}
                            className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all duration-300 ${
                                activeComponent === 'UserActions'
                                    ? 'bg-orange-600'
                                    : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        >
                            User Actions
                        </button>
                        <button
                            onClick={() => setActiveComponent('UserProfile')}
                            className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all duration-300 ${
                                activeComponent === 'UserProfile'
                                    ? 'bg-teal-600'
                                    : 'bg-teal-500 hover:bg-teal-600'
                            }`}
                        >
                            User Profile
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        {activeComponent === 'UserActions' ? (
                            <div>
                                <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                                    User Actions
                                </h2>
                                <UserActions />
                            </div>
                        ) : activeComponent === 'UserProfile' ? (
                            <div>
                                <h2 className="text-2xl font-semibold text-teal-600 mb-4">
                                    User Profile
                                </h2>
                                <UserProfile />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p className="text-lg">
                                    Please select an option above to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="bg-orange-600 text-white p-4">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm">
                        &copy; 2025 User Management Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default UserHome;
