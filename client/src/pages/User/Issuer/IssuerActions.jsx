import React, { useState } from 'react';
import { Award, Search, Ban, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import IssueCertificate from '../../../components/user/issuer/IssueCertificate';
import CheckCertificate from '../../../components/user/issuer/CheckCertificate';
import RevokeCertificate from '../../../components/user/issuer/RevokeCertificate';
import TrueCert_logo from '../../../assets/TrueCert_logo.svg';
import { useNavigate } from 'react-router-dom';

function IssuerActions() {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/user/issuer/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <Card className="mx-auto max-w-7xl border-none shadow-lg">
        {/* Header Section */}
        <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/90 p-2">
                <img
                  src={TrueCert_logo}
                  alt="TrueCert Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">TrueCert</CardTitle>
                <CardDescription className="text-purple-100">
                  Certificate Management System
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="gap-2 hover:bg-white/90 hover:text-purple-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-white">
          {/* Dashboard Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Issuer Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Manage your digital certificates with enhanced security and efficiency
            </p>
          </div>

          {/* Main Actions */}
          <Tabs 
            value={activeComponent} 
            onValueChange={setActiveComponent}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 gap-4 h-auto bg-slate-100">
              <TabsTrigger 
                value="IssueCertificate"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2 py-6 transition-all duration-300"
              >
                <Award className="h-4 w-4" />
                Issue Certificate
              </TabsTrigger>
              <TabsTrigger 
                value="CheckCertificate"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex items-center gap-2 py-6 transition-all duration-300"
              >
                <Search className="h-4 w-4" />
                Check Certificate
              </TabsTrigger>
              <TabsTrigger 
                value="RevokeCertificate"
                className="data-[state=active]:bg-rose-600 data-[state=active]:text-white flex items-center gap-2 py-6 transition-all duration-300"
              >
                <Ban className="h-4 w-4" />
                Revoke Certificate
              </TabsTrigger>
            </TabsList>

            <Card className="mt-6 border-none shadow-md bg-slate-50">
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] w-full rounded-md">
                  <TabsContent value="IssueCertificate">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-800">Issue a New Certificate</h2>
                      <IssueCertificate />
                    </div>
                  </TabsContent>

                  <TabsContent value="CheckCertificate">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-800">Check Existing Certificates</h2>
                      <CheckCertificate />
                    </div>
                  </TabsContent>

                  <TabsContent value="RevokeCertificate">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-800">Revoke a Certificate</h2>
                      <RevokeCertificate />
                    </div>
                  </TabsContent>

                  {!activeComponent && (
                    <div className="text-center py-12">
                      <h3 className="text-xl text-slate-500">
                        Select an action above to get started
                      </h3>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default IssuerActions;