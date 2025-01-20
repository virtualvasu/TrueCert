import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Icon for verification
import CheckCertificate from "../../../components/user/issuer/CheckCertificate"; // Import CheckCertificate component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Using Card components for consistent UI structure
import { Separator } from "@/components/ui/separator";

function RecipientHome() {
    const [showCheckCertificate, setShowCheckCertificate] = useState(false); // State to control showing CheckCertificate component
    const [isLoading, setIsLoading] = useState(false);

    // Handle the button click to display CheckCertificate
    const handleVerifyCertificate = () => {
        setShowCheckCertificate(true); // Show the CheckCertificate component
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 to-orange-100 flex flex-col justify-center items-center p-4">
            {/* Card Wrapper */}
            <Card className="w-full max-w-4xl border border-teal-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center space-y-6 pb-2">
                    <div className="mx-auto bg-teal-50 p-4 rounded-full w-fit">
                        <FaCheckCircle className="w-10 h-10 text-teal-600" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-orange-600">
                            Verify Certificate
                        </CardTitle>
                        <CardDescription className="text-slate-600 text-lg">
                            Blockchain-Powered Document Verification
                        </CardDescription>
                    </div>
                </CardHeader>

                {/* Main Content */}
                <CardContent className="space-y-8 p-6">
                    
                    

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

                    {/* Show CheckCertificate Component */}
                    {showCheckCertificate && (
                        <div className="mt-10">
                            <CheckCertificate />
                        </div>
                    )}
                </CardContent>

                <Separator className="bg-teal-200" />

                {/* Footer */}
                <footer className="bg-teal-600 text-white p-4 mt-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-sm">
                            &copy; 2025 TrueCert. All rights reserved.
                        </p>
                    </div>
                </footer>
            </Card>
        </div>
    );
}

export default RecipientHome;
