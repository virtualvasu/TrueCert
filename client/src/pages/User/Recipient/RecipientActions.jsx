import React, { useState } from "react";
import CheckCertificate from "../../../components/user/issuer/CheckCertificate";

function RecipientActions() {
    const [showCheckCertificate, setShowCheckCertificate] = useState(false);

    const toggleCheckCertificate = () => {
        setShowCheckCertificate((prev) => !prev);
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Home Page for Recipient
            </h1>
            <div className="text-center">
                <button
                    onClick={toggleCheckCertificate}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    {showCheckCertificate ? "Hide Check Certificate" : "Show Check Certificate"}
                </button>
            </div>
            {showCheckCertificate && (
                <div className="mt-6">
                    <CheckCertificate />
                </div>
            )}
        </div>
    );
}

export default RecipientActions;
