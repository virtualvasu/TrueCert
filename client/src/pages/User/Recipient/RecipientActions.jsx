import React, { useState } from "react";
import CheckCertificate from "../../../components/user/issuer/CheckCertificate";
import { Button, Card, Typography } from "@shadcn/ui"; // Importing from ShadCN UI

function RecipientActions() {
    const [showCheckCertificate, setShowCheckCertificate] = useState(false);

    const toggleCheckCertificate = () => {
        setShowCheckCertificate((prev) => !prev);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-100 to-purple-300 min-h-screen flex items-center justify-center py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <Card className="mb-6 p-6 shadow-xl rounded-lg bg-white">
                    <Typography variant="h1" className="text-3xl font-semibold text-indigo-700 text-center mb-4">
                        Home Page for Recipient
                    </Typography>
                    <Typography variant="body1" className="text-lg text-gray-600 text-center mb-4">
                        Welcome to your certificate portal. You can check your certificates here.
                    </Typography>
                </Card>

                {/* Button Section */}
                <div className="flex justify-center mb-6">
                    <Button
                        onClick={toggleCheckCertificate}
                        variant="solid"
                        color="indigo"
                        size="lg"
                        className="transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {showCheckCertificate ? "Hide Check Certificate" : "Show Check Certificate"}
                    </Button>
                </div>

                {/* Check Certificate Component */}
                {showCheckCertificate && (
                    <div className="mt-6">
                        <Card className="p-6 shadow-lg rounded-lg bg-gray-50">
                            <CheckCertificate />
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipientActions;
