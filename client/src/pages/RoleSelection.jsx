import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserCircle, Building, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-lg border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center space-y-6 pb-2">
          <div className="mx-auto bg-indigo-50 p-4 rounded-full w-fit">
            <Shield className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              TrueCert
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Blockchain-Powered Document Verification
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          <h2 className="text-lg text-center text-slate-600 font-medium">
            Select your role to continue
          </h2>

          <div className="space-y-4">
            <Link to="/admin/login" className="block">
              <Card className="group hover:shadow-md transition-all duration-300 border border-slate-200">
                <CardContent className="flex items-center p-4">
                  <div className="p-3 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <Building className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">Administrator</h3>
                    <p className="text-slate-500 text-sm">Manage Organisations</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/user/home" className="block">
              <Card className="group hover:shadow-md transition-all duration-300 border border-slate-200">
                <CardContent className="flex items-center p-4">
                  <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <UserCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">User</h3>
                    <p className="text-slate-500 text-sm">
                      Enter as issuer organisation or certificate holder
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>

          <Separator className="bg-slate-200" />

          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center text-slate-600">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2" />
              Secure
            </div>
            <div className="flex items-center text-slate-600">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-2" />
              Transparent
            </div>
            <div className="flex items-center text-slate-600">
              <div className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
              Verifiable
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RoleSelection;