import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import CheckCertificate from "../components/CheckCertificate";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function VerificationHome() {
    const [showCheckCertificate, setShowCheckCertificate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyCertificate = () => {
        setShowCheckCertificate(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex flex-col justify-center items-center p-4">
            <Card className="w-full max-w-4xl border border-purple-200 bg-white/90 backdrop-blur-sm shadow-xl shadow-purple-200/50">
                <CardHeader className="text-center space-y-6 pb-2">
                    <div className="mx-auto bg-purple-50 p-4 rounded-full w-fit shadow-lg">
                        <FaCheckCircle className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
                            TrueCert Verification Portal
                        </CardTitle>
                        <CardDescription className="text-slate-600 text-lg">
                            Blockchain-Powered Document Verification
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 p-6">
                    {!showCheckCertificate && (
                        <div className="text-center space-y-4">
                            <p className="text-gray-600 text-lg">
                                Verify the authenticity of certificates issued through TrueCert platform
                            </p>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-800 mb-2">How it works:</h3>
                                <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                                    <li>Enter the IPFS hash of the certificate</li>
                                    <li>Provide the issuer organization's Ethereum address</li>
                                    <li>Click verify to check authenticity on the blockchain</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            onClick={handleVerifyCertificate}
                            className={`px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : showCheckCertificate ? "Verify Another Certificate" : "Start Verification"}
                        </button>
                    </div>

                    {showCheckCertificate && (
                        <div className="mt-10">
                            <CheckCertificate />
                        </div>
                    )}
                </CardContent>

                <Separator className="bg-purple-200" />

                <footer className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 mt-10">
                    <div className="max-w-6xl mx-auto text-center space-y-2">
                        <p className="text-sm">
                            &copy; 2025 TrueCert. All rights reserved.
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm">
                            <span>Created with ❤️ by Vasu</span>
                            <span>•</span>
                            <a 
                                href="https://github.com/virtualvasu" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-purple-200 transition-colors duration-200 underline"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </footer>
            </Card>
        </div>
    );
}

export default VerificationHome;