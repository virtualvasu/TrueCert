import React, { useState } from 'react';
import { ArrowRight, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import StoreOrganisation from '../../components/admin/StoreOrganisation';
import CheckOrganisation from '../../components/admin/CheckOrganisation';
import RevokeOrganisation from '../../components/admin/RevokeOrganisation';
import TrueCert_logo from '../../assets/TrueCert_logo.svg'; // Your logo import
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowSection = (section) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveSection(null);
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    navigate('/admin/login'); // Adjust path for admin logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <Card className="mx-auto max-w-7xl border-none shadow-lg">
        {/* Header Section */}
        <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/90 p-2">
                <img src={TrueCert_logo} alt="TrueCert Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">TrueCert</CardTitle>
                <CardDescription className="text-blue-100">Blockchain-Powered Certificate Management</CardDescription>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="gap-2 hover:bg-white/90 hover:text-blue-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-white">
          {/* Dashboard Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Manage organizations and their certificates with enhanced security
            </p>
          </div>

          {/* Main Actions */}
          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 gap-4 h-auto bg-slate-100">
              <TabsTrigger 
                value="store"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white flex items-center gap-2 py-6 transition-all duration-300"
              >
                <ArrowRight className="h-4 w-4" />
                Store Organisation
              </TabsTrigger>
              <TabsTrigger 
                value="check"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex items-center gap-2 py-6 transition-all duration-300"
              >
                <ArrowRight className="h-4 w-4" />
                Check Organisation
              </TabsTrigger>
              <TabsTrigger 
                value="revoke"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2 py-6 transition-all duration-300"
              >
                <ArrowRight className="h-4 w-4" />
                Revoke Organisation
              </TabsTrigger>
            </TabsList>

            <Card className="mt-6 border-none shadow-md bg-slate-50">
              <CardContent className="p-6">
                <ScrollArea className="h-[600px] w-full rounded-md">
                  <TabsContent value="store">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-800">Store Organisation</h2>
                      <StoreOrganisation />
                    </div>
                  </TabsContent>

                  <TabsContent value="check">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-800">Check Organisation</h2>
                      <CheckOrganisation />
                    </div>
                  </TabsContent>

                  <TabsContent value="revoke">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-slate-800">Revoke Organisation</h2>
                      <RevokeOrganisation />
                    </div>
                  </TabsContent>

                  {!activeSection && (
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
};

export default AdminHome;
