import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserCircle, Building } from 'lucide-react';

function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col justify-center items-center p-4">
      {/* Logo and Branding */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
          TrueCert
        </h1>
        <p className="text-blue-100 text-lg">
          Blockchain-Powered Document Issuing and Verification
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl text-blue-100 text-center mb-6">
          Select your role to continue
        </h2>
        
        <Link
          to="/admin/login"
          className="flex items-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20 group"
        >
          <div className="p-3 rounded-lg bg-blue-700 group-hover:bg-blue-600 transition-colors">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-white">Administrator</h3>
            <p className="text-blue-100 text-sm">
              Manage Organisations
            </p>
          </div>
        </Link>

        <Link
          to="/user/home"
          className="flex items-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20 group"
        >
          <div className="p-3 rounded-lg bg-blue-700 group-hover:bg-blue-600 transition-colors">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-white">User</h3>
            <p className="text-blue-100 text-sm">
              Enter as issuer organisation or certificate holder
            </p>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-blue-200 text-sm">
        <p>Secure • Transparent • Verifiable</p>
      </div>
    </div>
  );
}

export default RoleSelection;
