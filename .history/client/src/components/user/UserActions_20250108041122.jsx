import React, { useState } from "react";
import CheckCertificate from "./actions/CheckCertificate";

function UserActions() {
    const [showComponent, setShowComponent] = useState(false);

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Header Section */}
            <h1 className="text-3xl font-extrabold text-orange-600 mb-6">
                User Actions
            </h1>
            <p className="text-gray-600 mb-8 text-center max-w-xl">
                Welcome to the user dashboard! Use the button below to check your certificates. This tool allows you to validate and manage your documents efficiently.
            </p>

            {/* Action Button */}
            <button
                onClick={() => setShowComponent(true)}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
            >
                Check Certificate
            </button>

            {/* Rendered Component */}
            <div className="mt-8 w-full max-w-4xl">
                {showComponent ? (
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <CheckCertificate />
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">
                        Click the button above to check your certificates.
                    </p>
                )}
            </div>
        </div>
    );
}

export default UserActions;
