import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, User } from "lucide-react";

function UserHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            TrueCert
          </CardTitle>
          <CardDescription className="text-lg text-slate-600">
            Select your user role to proceed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {/* Issuer Link */}
          <Link to="/user/issuer/login" className="block">
            <Button
              variant="outline"
              className="w-full py-6 text-lg border-2 hover:border-purple-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                <Building2 className="h-5 w-5" />
                <span className="font-semibold">Issuer Portal</span>
              </div>
            </Button>
          </Link>

          {/* Recipient Link */}
          <Link to="/user/recipient/home" className="block">
            <Button
              variant="outline"
              className="w-full py-6 text-lg border-2 hover:border-indigo-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                <User className="h-5 w-5" />
                <span className="font-semibold">Recipient Portal</span>
              </div>
            </Button>
          </Link>

          {/* Optional: Additional Info Card */}
          <Card className="mt-6 bg-slate-50 border-none">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-slate-500">
                Access and manage digital certificates securely with TrueCert
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserHome;