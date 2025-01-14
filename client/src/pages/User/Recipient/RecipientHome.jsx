import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Icon for verification
import CheckCertificate from "../../../components/user/issuer/CheckCertificate"; // Import CheckCertificate component

function RecipientHome() {
    const [showCheckCertificate, setShowCheckCertificate] = useState(false); // State to control showing CheckCertificate component
    const [isLoading, setIsLoading] = useState(false);

    // Handle the button click to display CheckCertificate
    const handleVerifyCertificate = () => {
        setShowCheckCertificate(true); // Show the CheckCertificate component
    };

    return (
        <div className="bg-gradient-to-br from-teal-100 to-orange-100 flex flex-col min-h-screen">
            {/* Header Section */}
            <header className="bg-teal-600 text-white p-6 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold">Verify Certificate</h1>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-teal-600 mb-4">
                            Verify Your Certificate
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Click the button below to verify the certificate.
                        </p>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyCertificate}
                            className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-teal-600 hover:bg-teal-700"
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify Certificate"}
                        </button>
                    </div>

                    {/* Show CheckCertificate Component */}
                    {showCheckCertificate && (
                        <div className="mt-10">
                            <CheckCertificate />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Section */}
            <footer className="bg-teal-600 text-white p-4 mt-10">
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
