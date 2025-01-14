import React, { useState } from "react";
import RecipientActions from "./RecipientActions";

function RecipientHome() {
    const [activeComponent, setActiveComponent] = useState('RecipientActions');

    return (
        <div className="bg-gradient-to-br from-orange-50 to-gray-100 flex flex-col">
            {/* Header Section */}
            <header className="bg-orange-600 text-white p-8 shadow-xl">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Recipient Dashboard
                    </h1>
                    <p className="text-lg mt-2 text-gray-200">
                        View and manage your certificates.
                    </p>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                    {/* Navigation Buttons */}
                    <div className="flex justify-center space-x-6 mb-8">
                        <button
                            onClick={() => setActiveComponent('RecipientActions')}
                            className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all duration-300 ${
                                activeComponent === 'RecipientActions'
                                    ? 'bg-orange-600'
                                    : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        >
                            Recipient Actions
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        {activeComponent === 'RecipientActions' && (
                            <div>
                                <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                                    Recipient Actions
                                </h2>
                                <RecipientActions />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="bg-orange-600 text-white p-4">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm">
                        &copy; 2025 Certificate Management Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default RecipientHome;
